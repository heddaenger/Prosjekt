
pool.query(`
CREATE TABLE Users (
userID INTEGER PRIMARY KEY, 
fullName VARCHAR (100) NOT NULL, 
email VARCHAR (100) NOT NULL, 
password VARCHAR (50) NOT NULL, 
phone INT NOT NULL); 

CREATE TABLE Booking (
bookingID INTEGER PRIMARY KEY,
seatsChosen INT NOT NULL,
date DATE NOT NULL, 
time INT NOT NULL,
Users_userID INTEGER REFERENCES Users (userID));

CREATE TABLE AdminUser (
adminID INTEGER PRIMARY KEY, 
adminUsername VARCHAR (50) NOT NULL, 
adminPassword VARCHAR (50) NOT NULL); 

INSERT INTO TABLE Users(...) VALUES (...);

`).then(result => {
    console.log(error, result);
});

