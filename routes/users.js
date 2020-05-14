const express = require('express');
const router = express.Router();


//require the jwt-tokens we use as cookies
const jwt = require('jsonwebtoken');
const secret = 'verysecret';

//import pool from index.js
const pool = require(".");



//adds a cookie to req.user
router.use((req, res, next) => {
    if (req.cookies && req.cookies['jwt-token']) {
        const decoded = jwt.verify(req.cookies['jwt-token'], secret);
        pool.query('SELECT * FROM "users" WHERE id = $1', [decoded.user_id]).then(result => {
            req.user = result.rows[0];
            next();
        });
    }else{
        next();
    }
});



//gets all the users, endpoint is not allowed if usertype is 2
router.get("/", async(req, res) => {
    const user = req.user;
    const usertype = user.usertype;
    if (usertype === 1){
    const rows = await readUsers();
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows))
    }
    else if (usertype === 2){
        res.status(403).send("Not allowed");
    }
});



// posts a user to the database using createUser(). to make admin, an admin must be logged in. redirect to loginpage.
router.post("/", async(req, res) => {
    try{
        let is_admin_user = false;
        try {
            is_admin_user = req.user.usertype === 1;
        } catch {
        }
        const user = req.user;
        const new_user = req.body;

        if (is_admin_user && req.body.make_admin === "is_admin") {
            new_user.usertype = 1;

        } else {
            new_user.usertype = 2
        }
        const success = await createUser(new_user);
        if(success){
            res.redirect('/loginPage.html');
        }else {
            res.send(JSON.stringify("Invalid phone number or email already in use"));
        }
        res.send({success: success});
    }
    catch(e){
    res.status(500).send("Error");
    }
});



//checks if username and password matches, if yes: add cookie and log in. redirect to admin / mypage.
router.post('/login', async(req, res) => {
    const user = req.body;
    try {
        const user_id = await getUserId(user.email, user.password);
        const result = await pool.query('SELECT * FROM "users" WHERE id = $1', [user_id]);
        const usertype = result.rows[0].usertype;
        const token = jwt.sign({user_id: user_id}, secret);
        res.cookie('jwt-token', token); //the cookie
        if(usertype === 1){
            res.redirect('/AdminPage.html');
        }else if(usertype === 2) {
            res.redirect('/MyPage.html');
        }
        res.send()
    } catch (e) {
        res.status(403).send("Incorrect username or password.");
    }
});



//logs out by removing cookie and redirect to loginpage.
router.post('/logout', async(req,res) => {
    try{
        const user = req.user;
        res.clearCookie('jwt-token');
        res.redirect('/loginPage.html');
    } catch (e)   {
        res.status(403).send("User not logged in.");
    }
});



//gets the information about the user logged in, expect password and id.
router.get('/me', async (req,res) =>{
        const user = req.user;
        delete user.password;
        delete user.id;
        res.send(JSON.stringify(user));
});



//posts to bookings using createBooking(). registers booking to logged in user.
router.post("/booking", async(req, res) => {
    try{
        const user = req.user;
        await createBooking(user, req.body);
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.redirect('/bookingConfirmation.html');
    }
});



//gets the bookings for the user logged in using readBooking().
router.get("/booking", async(req, res) => {
    const user_id = req.user.id;
    const rows = await readBooking(user_id);
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows))
});



//gets all the bookings. only allowed for usertype 1. using readAllBookings().
router.get("/allBookings", async(req, res) => {
         const user = req.user;
         const usertype = user.usertype;
     if(usertype === 1){
         const rows = await readAllBookings();
         res.setHeader("content-type", "application/json");
         res.send(JSON.stringify(rows))
     }
     else if(usertype === 2){
         res.status(403).send("Not allowed");
    }
});



//deletes users bookings (only allowed admin) using getUserBookings() to see them and deleteBookingDB to delete.
router.delete("/booking", async(req, res) => {
    let result = {};
    try {
        const booking = req.body;
        const user = req.user;
        let allow_delete = false;
        if (user.usertype === 1) { //the code that only allows admin
            allow_delete = true;
        } else {
            const userBookings = await getUserBookings(user.id);
            if (userBookings.indexOf(booking.id) !== -1) {
                allow_delete = true;
            }
        }
        if (allow_delete) {
            await deleteBookingDB(booking.id);
            result.success = true;
        } else {
            res.status(403).send();
        }
    } catch (e) {
        result.success = false;
    } finally {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result))
    }
});



//deletes users using deleteUserDB. only allowed for admin.
router.delete("/", async (req, res) =>{
    try{
        const user_id = req.body.id; //gets the userid from the body
        const user = req.user;
        if (user.usertype !== 1) {
            res.status(403).send("You do not have the privileges to delete users.");
        }
        await deleteUserDB(user_id);
        res.send();
    }
    catch (e){
        console.log(`${e}`);
        res.status(500).send();
    }
});



//updates the logged in user using updateUser().
router.post("/me", async (req, res)=> {
    try{
     const user = req.body;
     user.id = req.user.id;
     user.usertype = req.user.usertype;
     await updateUser(user);
     res.send();
    } catch (e){
        console.log(`${e}`);
    }
});



// now comes all our back-end functions



//selects all the users from the DB.
async function readUsers(){
    try{
        const results = await pool.query("SELECT * FROM users");
        return results.rows;
    } catch(e){
        return [];
    }
}


//inserts all the information about the user into the DB.
async function createUser(user) {
    try {
        let status = false;
        await pool.query("INSERT INTO users (fullName, email, password, phone, usertype) VALUES ($1, $2, $3, $4, $5)",
            [user.fname, user.email, user.password, user.phone, user.usertype]).then(s => {status = true; console.log(s);})
                                                                               .catch(e => {console.log(e);});
        return status;
    } catch (e) {
        return false;
    }
}


//updates logged in user in DB
async function updateUser(user){
    try {
        await pool.query("UPDATE users SET fullName=($1), password=($2), phone=($3) WHERE id=($4)",
            [user.fname, user.password, user.phone, user.id]);
        return true;
    } catch (e){
        console.log(`${e}`);
    }
}


//selects bookings from the logged in user
async function readBooking(user_id){
    try{
        const results = await pool.query("SELECT * FROM bookings WHERE userid = $1", [user_id]);
        return results.rows;
    } catch(e){
        return [];
    }
}


//inserts bookings into DB. registers on logged in user
async function createBooking(user, booking){
    try{
        await pool.query("INSERT INTO bookings (seatsChosen, date, time, userid, usertype) VALUES ($1, $2, $3, $4, $5)",
            [booking.seatsChosen, booking.date, booking.time, user.id, user.usertype]);
        return true;
    }catch(e) {
        console.log(`${e}`)
    }
}


//selects user where password and email is matching
async function getUserId(email, password) {
    try {
        const result = await pool.query("SELECT id FROM users WHERE password = ($1) AND email = ($2)", [password, email]);
        if (result.rowCount === 1) { //has to have both password and email
            return result.rows[0].id;
        } else {
            throw "User not found";
        }
    } finally {}

}


//select all bookings
async function readAllBookings(){
    try{
        const results = await pool.query("SELECT * FROM bookings");
        return results.rows;
    }
    catch(e){
          console.log(`${e}`); 
    }
}


//selects bookings from user logged in.
 async function getUserBookings(user_id) {
    try {
        const result = await pool.query("SELECT id FROM bookings WHERE userid = ($1)", [user_id]);
        let userBookings = [];
        return result.rows.map(item => item.id);
    } catch (e) {
        console.log(e);
    }
 }


 //deletes booking from DB
 async function deleteBookingDB(id) {
    try {
        pool.query("delete from bookings where id = ($1)", [id]).then(function(result) {
        });
        return true
    }
    catch(e){
        return false;
    }
}


//deletes user from DB
async function deleteUserDB(id) {
    try{
        await pool.query('delete from users where id = ($1)', [id]);
    }
    catch(e){
        console.log(`${e}`);
    }
}


//exports the router
module.exports = router;




