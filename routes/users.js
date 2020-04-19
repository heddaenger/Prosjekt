const express = require('express');
const router = express.Router();
module.exports = router;


router.post('/:id', (req, res) => {
    pool.query('UPDATE "user" SET name = $1 WHERE id = $2', [req.body.name, req.params.id]).then(result => {
        res.redirect('profile.html'); //når brukeren er oppdatert i databasen skal browseren sendes tilbake til profile.html siden
    })
});

const jwt = require('jsonwebtoken');
const secret = 'verysecret';

router.post('/login', (req, res) => {
    //sjekk brukernavn og passord mot databasen - hvis korrekt:
    const token = jwt.sign({user_id: user.id}, secret);
    res.cookie('jwt-token', token); //cookie for å holde styr på hvem som er logget inn
    res.send();
});

//legger til en stykke kode som kjører før alle route handlers (middleware)
router.use((req, res, next) => {
    if(req.cookies && req.cookies['jwt-token']) {
        const decoded = jwt.verify(req.cookies['jwt-token'],
            secret);

        pool.query('SELECT * FROM "user" WHERE id=$1', [decoded.user_id]).then(result => {
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

const pool = require('../public');

