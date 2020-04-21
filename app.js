const express = require('express');
const app = express();

app.listen(3050, () => {
    console.log('listening');
});

const router = require("./routes/users");
const pool = require("./routes");

app.use(express.static('public'));
app.use('/users', router); //forteller at alle router som starter med /users skal håndteres av våres router fra routes/users.js

//en route som henter alle brukere i databasen
router.get("/:id", (req, res) => {
    pool.query('SELECT * FROM "user" WHERE id = $1', [req.params.id]).then(result => { //simpel SQL query: velger all data fra user
        res.json(result.rows);  //kaller metoden json på res objektet; vi vil gjerne sende JSON tilbake til klienten
    })
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());
