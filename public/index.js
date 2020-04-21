//Connecting to postgres database
const { Pool, Client } = require('pg');
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    database: 'postgres',
    password: 'postgres',
});

pool.query('SELECT NOW()').then(result => {
    console.log(result.rows);
    pool.end()
});

module.exports = pool;

//Hvorfor bruke pool og ikke client?

/*
const {Client} = require ('pg')
const client = new Client ({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    database: 'postgres',
    password: 'postgres',
});

client.connect()
.then(() => console.log ("Connected succesfully"));
.then(() => client.query("Select * from employees")):
.then(results => console.table(results.rows);
.cath(e => console.log(e));
.finally(() => client.end));
 */

