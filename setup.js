const pool = require('./routes/index');
pool.query(`
CREATE TABLE UserTypes (
id SERIAL PRIMARY KEY,
roletype text NOT NULL);

CREATE TABLE Users (
id SERIAL PRIMARY KEY, 
fullName text NOT NULL, 
email text UNIQUE NOT NULL, 
password text NOT NULL, 
phone INT NOT NULL, 
userType INTEGER REFERENCES UserTypes(id) ON DELETE CASCADE); 

CREATE TABLE Bookings (
id SERIAL PRIMARY KEY,
seatsChosen INT NOT NULL,
date DATE NOT NULL, 
time NUMERIC NOT NULL,
userId INTEGER REFERENCES Users(id) ON DELETE CASCADE,
userType INTEGER REFERENCES UserTypes(id) ON DELETE CASCADE);   


`).then(() => pool.query("INSERT INTO UserTypes (roletype) VALUES ($1)", ['Administrator']))
    .then(() => pool.query("INSERT INTO UserTypes (roletype) VALUES ($1)", ['Customer']))
    .then(() => pool.query("INSERT INTO Users (fullName, email, password, phone, userType) VALUES ($1, $2, $3, $4, $5)", ['Überadmin', 'adm@gmail.com', 'abc', 42927999, 1]))
    .then(result => {
    console.log(result);
});

/*  Her lager vi setup til databasen i postgreSQL. Vi lager alle tabellene i databasen vår og så legger vi inn én hardcodet admin.
    Denne adminen kan gjøre andre til admins dersom den selv er logget inn (koden til dette ligger i backenden vår users.js).
 */

