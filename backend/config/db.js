const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Ensure environment variables are loaded for this module context
dotenv.config();

// Create a connection pool optimized for high throughput
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

// Immediately verify connection health upon module initialization
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('DATABASE LINK SYSTEM: Successfully connected to MySQL ("medintel" schema).');
        connection.release();
    } catch (error) {
        console.error('DATABASE LINK SYSTEM FAILURE: Check your credentials in backend/.env');
        console.error('Error Details:', error.message);
    }
})();

module.exports = pool;