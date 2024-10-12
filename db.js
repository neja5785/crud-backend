// db.js
require('dotenv').config();

const { Pool } = require('pg');

// Create a new pool for managing connections
const pool = new Pool({
    user: process.env.PGUSER,         // PostgreSQL username
    host: process.env.PGHOST,         // PostgreSQL server address
    database: process.env.PGDATABASE, // Your database name
    password: process.env.PGPASSWORD, // PostgreSQL password
    port: process.env.PGPORT || 5432, // PostgreSQL port (default is 5432)
    ssl:  { rejectUnauthorized: false }
});
console.log('PGPASSWORD:', process.env.PGPASSWORD); // Log this to verify password

console.log('PGUSER:', process.env.PGUSER); // Log this to verify password


// Export a query function that can be used to interact with the database
module.exports = {
    query: (text, params) => pool.query(text, params),
};