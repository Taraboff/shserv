const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const formidable = require('formidable');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mprint'
});

router.get('/mprintinit', function (req, res) {
    const sql = 'SELECT * FROM tasks;';
    connection.query(sql, (err, results) => {
        if (err) console.log(err);
        res.send(JSON.stringify(results));
    });
});

router.post('/mprintupdate', function (req, res) {
    const data = {};
    const form = formidable({ multiples: true });
    try {
        form.parse(req, (err, fields) => {
            if (err) {
                next(err);
                return;
            }
            const sql = `UPDATE tasks SET username='${fields.username}' WHERE id=${fields.id};`;
            connection.query(sql, (err, results) => {
                if (err) {
                    data.msg = `Ошибка записи в базу данных: ${err}`;
                    console.log(err);
                    return res.json(data.msg);
                } else {
                    data.msg = "Database updated"
                    res.json(data.msg);
                }
            });
        });
    } catch (e) {
        console.log(e, req);
    }
    
});

module.exports = router;