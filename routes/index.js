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
});

module.exports = pool;



