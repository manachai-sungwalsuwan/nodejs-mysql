const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// MySQL Connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err);
        return;
    }

    console.log('Connected to MySQL Server');
});

module.exports = connection;
