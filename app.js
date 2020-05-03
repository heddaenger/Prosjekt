const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.listen(3050, () => {
    console.log('listening');
});

app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

const pool = require("./routes");

const {router, jwt, secret} = require('./routes/users');

app.use(express.static('public'));

app.use('/users', router); //forteller at alle router som starter med /users skal håndteres av våres router fra routes/users.js

app.get("/", (req, res) => res.sendFile(`${__dirname}/registration.html`))

app.get("/registration", async(req, res) => {
    const rows = await readUsers();
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows))
});

app.post("/registration", async(req, res) => {
    try{
        const user = req.body;
        await createUsers(user);
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.redirect('/loginPage.html');
    }
});

app.post('/login', async(req, res) => {
    //sjekk brukernavn og passord mot databasen - hvis korrekt:
    const user = req.body;
    try {
        const user_id = getUserId(user.email, user.password);
        console.log(user_id);
        const token = jwt.sign({user_id: user_id}, secret);
        res.cookie('jwt-token', token); //cookie for å holde styr på hvem som er logget inn
        //res.redirect('/registration.html');
        res.send();

    } catch (e) {
        res.status(403).send("Unknown user.");
    }


});

async function getUserId(email, password) {
    try {
        console.log("Working???!!!")
        const result = await pool.query("SELECT id FROM users WHERE password = ($1) AND email = ($2)", [password, email]);
        console.log(result);
        if (result.length === 1) {
            return result.id;
        }
        throw "Not found";
    } catch (e) {
        console.log("error");
    }
}


async function readUsers(){
    try{
        const results = await pool.query("SELECT * FROM users");
        return results.rows;
    } catch(e){
        return[];
    }
};


async function createUsers(user){
    try{
        await pool.query("INSERT INTO users (fullName, email, password, phone) VALUES ($1, $2, $3, $4)",
            [user.fname, user.email, user.password, user.phone]);
        console.log("Inserted into db");

        return true;
    } catch (e) {
      console.log(`${e}`);

    }
}

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

