const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin3',
    database: 'mprint'
});

router.get('/init', function (req, res) {
    const sql = 'SELECT * FROM users;';
    connection.query(sql, (err, results) => {
        if (err) console.log(err);
        res.send(JSON.stringify(results));
    });
});

module.exports = router;