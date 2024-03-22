const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3307',
    user: 'root',
    password: 'password',
    database: 'feeedapps'
})

connection.connect((err) => {
    if (err) {
        console.log("Error establishing connection");
        return;
    }
    console.log("Database Connected!")
})

module.exports = connection;