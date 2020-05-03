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


app.get("/", (req, res) => res.sendFile(`${__dirname}/registration.html`));









/*//en route som henter alle brukere i databasen
router.get("/:id", (req, res) => {
    pool.query('SELECT * FROM "user" WHERE id = $1', [req.params.id]).then(result => { //simpel SQL query: velger all data fra user
        res.json(result.rows);  //kaller metoden json på res objektet; vi vil gjerne sende JSON tilbake til klienten
    })
});

router.post('/:id', (req, res) => {
    pool.query('UPDATE "Users" SET fullName = $1 WHERE id = $2', [req.body.fullName, req.params.id]).then(result => {
        res.redirect('profile.html'); //når brukeren er oppdatert i databasen skal browseren sendes tilbake til profile.html siden
    })
});



router.use((req, res, next) => {
    if(req.cookies && req.cookies['jwt-token']) {
        const decoded = jwt.verify(req.cookies['jwt-token'],
            secret);

        pool.query('SELECT * FROM "Users" WHERE id=$1', [decoded.user_id]).then(result => {
            req.user = result.rows[0];
            next();
        });
    } else {
        next();
    }
});

router.get('/me', (req,res) => {
    res.json(req.user);
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());
*/

