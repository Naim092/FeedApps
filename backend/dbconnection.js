const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '0000',
    database: 'feedsdb'
})

connection.connect((err) => {
    if (err) {
        console.log("Error establishing connection");
        return;
    }
    console.log("Database Connected!")
})

module.exports = connection;