const mysql = require('mysql2')
require('dotenv').config()

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "a0521_node_mysql"
})

module.exports = pool.promise()