
pool.query(`
CREATE TABLE Users (
id SERIAL PRIMARY KEY, 
fullName text VARCHAR (100) NOT NULL, 
email text VARCHAR (100) NOT NULL, 
password text VARCHAR (50) NOT NULL, 
phone INT NOT NULL); 

CREATE TABLE Booking (
id SERIAL PRIMARY KEY,
seatsChosen INT NOT NULL,
date DATE NOT NULL, 
time INT NOT NULL,
Users_id INTEGER REFERENCES Users(id) ON DELETE CASCADE);

CREATE TABLE AdminUser (
id SERIAL PRIMARY KEY, 
adminUsername text VARCHAR (50) NOT NULL, 
adminPassword text VARCHAR (50) NOT NULL); 

INSERT INTO TABLE Users(...) VALUES (...);

`).then(result => {
    console.log(error, result);
});

