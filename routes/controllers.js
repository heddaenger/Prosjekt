const pool = require('./routes/index');

module.exports = async function readUsers(){
    try{
        const results = await pool.query("SELECT * FROM users");
        return results.rows;
    } catch(e){
        return [];
    }
};


//legger inn informasjonen i en database
module.exports = async function createUsers(user) {
    try {
        let status = false;
        await pool.query("INSERT INTO users (fullName, email, password, phone, usertype) VALUES ($1, $2, $3, $4, $5)",
            [user.fname, user.email, user.password, user.phone, user.usertype]).then(s => {status = true; console.log(s);})
            .catch(e => {console.log(e);});
        return status;
    } catch (e) {
        return false;
    }
};


module.exports = async function updateUser(user){
    try {
        await pool.query("UPDATE users SET fullName=($1), password=($2), phone=($3) WHERE id=($4)",
            [user.fname, user.password, user.phone, user.id]);
        return true;
    } catch (e){
        console.log(`${e}`);
    }
};


module.exports = async function readBooking(user_id){
    try{
        const results = await pool.query("SELECT * FROM bookings WHERE userid = $1", [user_id]);
        return results.rows;
    } catch(e){
        return [];
    }
};



module.exports = async function createBooking(user, bookings){
    try{
        await pool.query("INSERT INTO bookings (seatsChosen, date, time, userid, usertype) VALUES ($1, $2, $3, $4, $5)",
            [bookings.seatsChosen, bookings.date, bookings.time, user.id, user.usertype]);
        return true;
    }catch(e) {
        console.log(`${e}`)
    }
};


module.exports = async function getUserId(email, password) {
    try {
        const result = await pool.query("SELECT id FROM users WHERE password = ($1) AND email = ($2)", [password, email]);
        if (result.rowCount === 1) {
            return result.rows[0].id;
        } else {
            throw "User not found";
        }
    } finally {}

};


module.exports = async function readAllBookings(){
    try{
        const results = await pool.query("SELECT * FROM bookings");
        return results.rows;
    }
    catch(e){
        console.log(`${e}`);
    }
};



module.exports = async function deleteBookingDB(id) {
    try {
        pool.query("delete from bookings where id = ($1)", [id]).then(function(result) {
        });
        return true
    }
    catch(e){
        return false;
    }
};

module.exports = async function deleteUserDB(id) {
    try{
        await pool.query('delete from users where id = ($1)', [id]);
    }
    catch(e){
        console.log(`${e}`);
    }
};




