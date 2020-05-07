const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const secret = 'verysecret';

const pool = require(".");



//
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



//Henter alle brukerne i databasen og sender de som JSON-objekter
router.get("/", async(req, res) => {
    const rows = await readUsers();
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows))
});



/*Bruker funksjonen createUsers til å lagre brukeren i DB. Dersom det er en admin logget inn og brukeren requester å bli admin,
kan adminen godkjenne dette og gjøre brukeren til admin. */
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
        const success = await createUsers(new_user);
        if(success){
            res.redirect('/loginPage.html');
        }else {
            res.send(JSON.stringify("Invalid phone number or email already in use"));
        }
        res.send({sucess: success});

    }
    catch(e){
    console.log(`${e}`);
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

router.post('/logout', async(req,res) => {
    try{
        const user = req.user;
        res.clearCookie('jwt-token');
        res.redirect('/loginPage.html');
    } catch (e)   {
        res.status(403).send("User not logged in.");
    }
});




//dette endpointet henter informasjonen om hver enkelt bruker. Denne informasjonen innbærer ikke passord eller id.
router.get('/me', async (req,res) =>{
        const user = req.user;
        delete user.password;
        delete user.id;
        res.send(JSON.stringify(user));
});



//dette endpointet bruker funksjonen createBooking til å lagre bookings i DB.
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


//Henter bookings fra DB og viser brukeren hvilke bookings de har.
router.get("/booking", async(req, res) => {
    const user_id = req.user.id;
    const rows = await readBooking(user_id);
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows))
});



//Henter alle bookingsene i DB for å vise dem til adminen. Dersom noen som ikke er admins er på siden vil de få en 403.
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



//Sletter bookings i DB
router.delete("/booking", async(req, res) => {
    let result = {};
    try {
        const booking = req.body;
        const user = req.user;
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
    try{
        const user_id = req.body.id;
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
        console.log(user);
        let status = false;
        await pool.query("INSERT INTO users (fullName, email, password, phone, usertype) VALUES ($1, $2, $3, $4, $5)",
            [user.fname, user.email, user.password, user.phone, user.usertype]).then(s => {status = true; console.log(s);})
                                                                               .catch(e => {console.log(e);});
        return status;
    } catch (e) {
        return false;
    }
}


async function updateUser(user){
    try {
        await pool.query("UPDATE users SET fullName=($1), password=($2), phone=($3) WHERE id=($4)",
            [user.fname, user.password, user.phone, user.id]);
        return true;
    } catch (e){
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
        await pool.query("INSERT INTO bookings (seatsChosen, date, time, userid, usertype) VALUES ($1, $2, $3, $4, $5)",
            [bookings.seatsChosen, bookings.date, bookings.time, user.id, user.usertype]);
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
        await pool.query('delete from users where id = ($1)', [id]);
    }
    catch(e){
        console.log(`${e}`);
    }
}



module.exports = router;




