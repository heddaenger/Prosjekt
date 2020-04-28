const pool = require('./routes/index');
pool.query(`
CREATE TABLE Users (
id SERIAL PRIMARY KEY, 
fullName text NOT NULL, 
email text NOT NULL, 
password text NOT NULL, 
phone INT NOT NULL); 

CREATE TABLE Booking (
id SERIAL PRIMARY KEY,
seatsChosen INT NOT NULL,
date DATE NOT NULL, 
time INT NOT NULL,
Users_id INTEGER REFERENCES Users(id) ON DELETE CASCADE);

CREATE TABLE adminUser (
id SERIAL PRIMARY KEY, 
fullName text NOT NULL, 
email text NOT NULL, 
password text NOT NULL, 
phone INT NOT NULL);

`).then(result => {
    console.log(result);
});

