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
        res.json(results);
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

                const sql = `INSERT INTO tasks (id, username, printer, cartridge, workstatus, location, datein, comment) 
                                    VALUES("${+fields.id}", 
                                            "${fields.username}", 
                                            "${fields.printer}", 
                                            "${fields.cartridge}", 
                                            "${fields.workstatus}", 
                                            "${fields.location}", 
                                            "${fields.datein}", 
                                            "${fields.comment}")
                            ON DUPLICATE KEY UPDATE id="${fields.id}",
                                            username="${fields.username}",
                                            printer="${fields.printer}", 
                                            cartridge="${fields.cartridge}", 
                                            workstatus="${fields.workstatus}", 
                                            location="${fields.location}",
                                            datein="${fields.datein}",
                                            comment="${fields.comment}";`
      
            
            connection.query(sql, (err, results) => {
                if (err) {
                    data.msg = `Ошибка записи в базу данных: ${err}`;
                    console.log(err);
                    return res.send(JSON.stringify(data.msg));
                } else {
                    data.msg = "Database updated"
                    res.send(JSON.stringify(data.msg));
                }
            });
        });
    } catch (e) {
        console.log(e, req);
    }

});
router.get('/mprintdelete/:id', function(req, res) {
    const sql = `DELETE FROM tasks WHERE id=${req.params.id};`;
    let out = {};
    try {
        connection.query(sql, (err, results) => {
            if (err) console.log(err);
            out.result = `Удалена запись: ${req.params.id}`;
            res.send(JSON.stringify(out));
        });
        } catch (e) {
            console.log(e);
        }
});

module.exports = router;