//reqiures express, body-parser and cookie-parser
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//makes app use express
const app = express();


// listens for connection on port 3000
app.listen(3000, () => {
    console.log('listening');
});

//requires users.js
const router= require('./routes/users');

//uses bodyParser and cookieParser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

//serves CSS files and JS-files in our directory public.
app.use(express.static('public'));


//makes every endpoint starting with /users go through routes from routes/users.js
app.use('/users', router);


//starts the website off at loginpage.
app.get("/", (req, res) => res.sendFile(`${__dirname}/loginPage.html`));

