const pool = require('./routes/index');
pool.query(`
CREATE TABLE UserTypes (
id SERIAL PRIMARY KEY,
roletype text NOT NULL);

CREATE TABLE Users (
id SERIAL PRIMARY KEY, 
fullName text NOT NULL, 
email text NOT NULL, 
password text NOT NULL, 
phone INT NOT NULL, 
userType INTEGER REFERENCES UserTypes(id) ON DELETE CASCADE); 

CREATE TABLE Bookings (
id SERIAL PRIMARY KEY,
seatsChosen INT NOT NULL,
date DATE NOT NULL, 
time NUMERIC NOT NULL,
userId INTEGER REFERENCES Users(id) ON DELETE CASCADE);


`).then(() => pool.query("INSERT INTO UserTypes (roletype) VALUES ($1)", ['Administrator']))
    .then(() => pool.query("INSERT INTO UserTypes (roletype) VALUES ($1)", ['Customer']))
    .then(() => pool.query("INSERT INTO Users (fullName, email, password, phone, userType) VALUES ($1, $2, $3, $4, $5)", ['Überadmin', 'adm@gmail.com', 'abc', 42927999, 1]))
    .then(result => {
    console.log(result);
});


