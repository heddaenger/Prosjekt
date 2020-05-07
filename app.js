const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.listen(3000, () => {
    console.log('listening');
});

const router= require('./routes/users');


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use('/users', router); //forteller at alle router som starter med /users skal håndteres av våres router fra routes/users.js


app.get("/", (req, res) => res.sendFile(`${__dirname}/loginPage.html`));

