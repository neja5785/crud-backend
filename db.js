
require('dotenv').config();

const { Pool } = require('pg');


const pool = new Pool({
    user: process.env.PGUSER,        
    host: process.env.PGHOST,        
    database: process.env.PGDATABASE, 
    password: process.env.PGPASSWORD, 
    port: process.env.PGPORT || 5432, 
    ssl:  { rejectUnauthorized: false }
});
console.log('PGPASSWORD:', process.env.PGPASSWORD); 
console.log('PGUSER:', process.env.PGUSER); 

module.exports = {
    query: (text, params) => pool.query(text, params),
};