const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const secret = 'verysecret';

const pool = require(".");


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


router.get("/", async(req, res) => {
    const rows = await readUsers();
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows))
});


//prøver å bruke funksjonen createUsers til å lagre brukeren.
router.post("/", async(req, res) => {
    try{
        const user = req.user;
        const new_user = req.body;

        if (user.usertype === 1 && req.body.make_admin === "is_admin") {
            new_user.usertype = 1;
        } else {
            new_user.usertype = 2
        }
        await createUsers(new_user);

    }
    catch(e){
        result.success=false;
    }
    finally{
        res.redirect('/loginPage.html');
    }
});



router.post('/login', async(req, res) => {
    //sjekk brukernavn og passord mot databasen - hvis korrekt:
    const user = req.body;
    try {
        const user_id = await getUserId(user.email, user.password);
        const result = await pool.query('SELECT * FROM "users" WHERE id = $1', [user_id]);
        const usertype = result.rows[0].usertype;
        const token = jwt.sign({user_id: user_id}, secret);
        res.cookie('jwt-token', token); //cookie for å holde styr på hvem som er logget inn
        if(usertype === 1){
            res.redirect('/AdminPage.html');
        }else if(usertype === 2) {
            res.redirect('/MyPage.html');
        }
        res.send()
    } catch (e) {
        console.log(`${e}`);
        res.status(403).send("Incorrect username or password.");
    }
    finally {
    }
});



router.get('/me', async (req,res) =>{
        const user = req.user;
        delete user.id;
        delete user.password;
        res.send(JSON.stringify(user));
});




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



router.get("/booking", async(req, res) => {
    const user_id = req.user.id;
    const rows = await readBooking(user_id);
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows))
});


router.get("/allBookings", async(req, res) => {
 const user = req.user;
 const usertype = user.usertype;
 if(usertype === 1){
     const rows = await readAllBookings();
     res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows))
 } else if(usertype === 2){
    res.status(403).send("Not allowed");
 }
   });


router.delete("/booking", async(req, res) => {
    let result = {};
    try {
        const booking = req.body;
        const user = req.user;
        console.log(booking);
        console.log(user);
        await deleteBookingDB(booking.id, user.id);
        result.success = true;
    } catch (e) {
        result.success = false;
    } finally {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result))
    }
});


router.delete("/", async (req, res) =>{
    let result = {};
    try{
        const booking = req.body;
        const user = req.user;
        await deleteBookingDB(booking.id, user.id); 
        await deleteUserDB(user.id);
        result.success = true;
    }
    catch(e){
        console.log(`${e}`)
    }
    finally{
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result))
    }
});


async function readUsers(){
    try{
        const results = await pool.query("SELECT * FROM users");
        return results.rows;
    } catch(e){
        return [];
    }
}


//legger inn informasjonen i en database
async function createUsers(user) {
    try {
        await pool.query("INSERT INTO users (fullName, email, password, phone, usertype) VALUES ($1, $2, $3, $4, $5)",
            [user.fname, user.email, user.password, user.phone, user.usertype]);
        return true;
    } catch (e) {
        console.log(`${e}`);
    }
}


async function readBooking(user_id){
    try{
        const results = await pool.query("SELECT * FROM bookings WHERE userid = $1", [user_id]);
        return results.rows;
    } catch(e){
        return [];
    }
}



async function createBooking(user, bookings){
    try{
        await pool.query("INSERT INTO bookings (seatsChosen, date, time, userid) VALUES ($1, $2, $3, $4)",
            [bookings.seatsChosen, bookings.date, bookings.time, user.id]);
        return true;
    }catch(e) {
        console.log(`${e}`)
    }
}


async function getUserId(email, password) {
    try {
        const result = await pool.query("SELECT id FROM users WHERE password = ($1) AND email = ($2)", [password, email]);
        if (result.rowCount === 1) {
            return result.rows[0].id;
        } else {
            throw "User not found";
        }
    } finally {}

}


async function readAllBookings(){
    try{
        const results = await pool.query("SELECT * FROM bookings");
        return results.rows;
    }
    catch(e){
          console.log(`${e}`); 
    }
}



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

async function deleteUserDB(id) {
    try{
        pool.query('delete from users where id = ($1)', [id]).then(function(result) {

            });
    }
    catch(e){
        console.log(`${e}`);
    }
}



module.exports = router;




