const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const formidable = require('formidable');


const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root', // 'root' for DEV   'admin3' for PRODUCTION
    database: 'mprint'
});

router.get('/mprint/init', function(req, res) {
    const initarr = [];
    const sql_all = 'SELECT * FROM tasks;';
    const sql_get_last = 'SELECT datetime FROM logs ORDER BY id DESC LIMIT 0, 1;'

    // const promisePool = connection.promise();

    connection.promise().query(sql_get_last)
    .then( ([rows]) => {
        // if (err) console.log(err);
        initarr.push(rows);
        return;
    })
    .then(connection.promise().query(sql_all)
    .then( ([rows,fields]) => {
        // if (err) console.log(err);
        initarr.push(rows);
        res.end(JSON.stringify(initarr));
    }));
    
    

    // res.set({
    //     "Access-Control-Allow-Origin": "*",
    // });

});

router.post('/mprintupdate', function(req, res) {
    const data = {};
    const form = formidable({ multiples: true });
    try {
        form.parse(req, (err, fields) => {
            if (err) {
                next(err);
                return;
            }

            const sql = `INSERT INTO tasks (id, username, printer, cartridge, workstatus, statuscode, location, datein, comment) 
                                    VALUES("${+fields.id}", 
                                            "${fields.username}", 
                                            "${fields.printer}", 
                                            "${fields.cartridge}", 
                                            "${fields.workstatus}", 
                                            "${fields.statuscode}", 
                                            "${fields.location}", 
                                            "${fields.datein}", 
                                            "${fields.comment}")
                            ON DUPLICATE KEY UPDATE id="${fields.id}",
                                            username="${fields.username}",
                                            printer="${fields.printer}", 
                                            cartridge="${fields.cartridge}", 
                                            workstatus="${fields.workstatus}", 
                                            statuscode="${fields.statuscode}", 
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

router.post('/mprint/savelog', function(req, res) {
    const data = {};
    const form = formidable({ multiples: true });
    try {
        form.parse(req, (err, fields) => {
            if (err) {
                next(err);
                return;
            }

            const sql = `INSERT logs(datetime, client, description) VALUES ('${fields.datetime}', '${fields.client}', '${fields.description}');`;

            connection.query(sql, (err, results) => {
                if (err) {
                    data.msg = `Ошибка записи в базу данных: ${err}`;
                    console.log(err);
                    return res.send(JSON.stringify(data.msg));
                } else {
                    data.msg = "Database updated"
                    res.set({
                        "Access-Control-Allow-Origin": "*",
                    });
                    // console.log('results: ', results.insertId);
                    // res.send(data);

                    const sql_last_insert_id = `SELECT datetime FROM logs WHERE id=${results.insertId};`
                    connection.query(sql_last_insert_id, async(err, results) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('results-insert id: ', JSON.stringify(results[0]));
                            res.json(results[0]);
                        }
                    });
                }
            });
        });
    } catch (e) {
        console.log(e);
    }

});

module.exports = router;