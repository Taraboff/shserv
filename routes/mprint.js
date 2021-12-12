const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
// var app = express();

let jsonParser = bodyParser.json();
// app.use(bodyParser.json({ type: 'application/*+json' }))
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

router.post('/mprintupdate', jsonParser, function (req, res) {
    let msob = {};
    // console.log(req);
    // const body = JSON.parse(req.body);
    // console.log(body);
    const userdata = req.body;
    console.log('userdata: ', userdata);

    // const bd = body ? "body.ok" : "body.not.ok";
    // console.log('bd: ', bd);
    // msob.bd = body;

    const sql = `UPDATE tasks SET username='${userdata.id}' WHERE id=1;`;
    try {
        connection.query(sql, (err, results) => {
            if (err) {
                msob.msg = `Ошибка записи в базу данных: ${err}`;
                console.log(err);
                return res.send(msob);
            } 
        });
    } catch (e) {
        console.log(e, req);
    }
});

module.exports = router;