const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const gm = require('gm');
const path = require('path');
const mysql = require('mysql2');
let newName, errMsg, uploadMsg;


const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lean'
});

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        let name = file.originalname.toLowerCase();
        const space = '_';   // разделитель между словами в имени файла
        let link = '';
        let ext = path.extname(name);

        let translitArray = {
            "а": "a", 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
            'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
            'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': space,
            'ы': 'y', 'ь': space, 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };

        let translate = function (v) {   // функция транслитерации
            if (/[а-яё]/.test(v)) {
                link = translitArray[v];
            } else if (/[a-z0-9]/.test(v)) {
                link = v;
            } else {
                if (link.slice(-1) !== space) link = space;
            }
            return link;
        }

        let translitedName = Array.from(name, (v) => translate(v)).join('');
        newName = `${req.body.dept}_${req.body.stend}_${req.body.pocket}_${translitedName}${ext}`;

        cb(null, newName);
    }
});

const fileFilter = (req, file, cb) => {

    const allowedFileTypes = ["image/jpg", "image/jpeg", "image/png", "application/pdf"];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        req.fileValidationError = 'Неверный тип документа!';
        cb(null, false);
    }
}
const upload = multer({ storage: storageConfig, fileFilter });


router.post('/upload', upload.single("uploadfile"),  function (req, res, next) {
    uploadMsg = {};

    if (req.fileValidationError) {
        uploadMsg.msg = req.fileValidationError;
        return res.send(JSON.stringify(uploadMsg));
    }
    else if (!req.file) {
        uploadMsg.msg = 'Пожалуйста, выберите файл для загрузки';
        return res.send(JSON.stringify(uploadMsg));
    }
    
    uploadMsg.msg = `Файл "${req.file.originalname}" загружен на сервер`;
    uploadMsg.file = req.file.filename; 
        
    //  запись в БД имени файла
    const sql = `UPDATE stends SET ${req.body.pocket}='${req.file.filename}' WHERE dept=${req.body.deptId} AND version='${req.body.stend}';`;
    try {
        connection.query(sql, (err, results) => {
            if (err) {
                uploadMsg.msg = `Ошибка записи в базу данных: ${err}`;
                console.log(err);
                return res.send(uploadMsg.msg);
            } 
        });
    } catch (e) {
        console.log(e);
    }

        const convFileName = req.file.filename.split('.')[0] + '.thumb.png';
        const inputFile = path.join(__dirname, '..', 'uploads', req.file.filename);
        const outputFile = path.join(__dirname, '..', 'uploads', 'thumbs', convFileName);
        const formats = {'a4': {'width': 180, 'height': 290},
                        'a4r': {'width': 300, 'height': 180},
                        'a5': {'width': 135, 'height': 100} };
        size = formats[req.body.format];

        uploadMsg.thumb = convFileName;

        gm(inputFile)
            .resize(size.width, size.height, '!')
            .write(outputFile, function (err) {
                if (!err) {
                    console.log(`File converted to ${convFileName}`);
                    res.send(JSON.stringify(uploadMsg));
                } else {
                    console.log(err);
                    return res.send(err);
                }
            });
});

router.post('/new', function(req, res) {
    const body = JSON.parse(req.body.data);
    const sql_new_stend = `INSERT stends(dept, version) VALUES (${body.dept}, '${body.stend}');`;
    
    try {
        connection.query(sql_new_stend, (err, results) => {
            if (err) console.log(err);
            res.send(JSON.stringify(results));
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/getactive/:deptId', function(req, res) {
    const sql = `SELECT * FROM current WHERE dept=${req.params.deptId};`;
    try {
        connection.query(sql, (err, results) => {
            if (err) console.log(err);
            res.send(JSON.stringify(results));
        });
        } catch (e) {
            console.log(e);
        }
});

router.post('/setactive', function(req, res) {
    let sql;
    if (req.body.checked) {
        sql = `INSERT INTO current (dept,activestend) VALUES (${req.body.dept}, ${req.body.stendId}) 
        ON DUPLICATE KEY UPDATE activestend=${req.body.stendId};`
    } else {
        sql = `DELETE FROM current WHERE dept=${req.body.dept} AND activestend=${req.body.stendId};`
    }
    try {
        connection.query(sql, (err, results) => {
            if (err) console.log(err);
            res.send(JSON.stringify(results));
        });
        } catch (e) {
            console.log(e);
        }
});

router.get('/getstends/:deptId', function (req, res) {
    const sql = `SELECT * FROM stends WHERE dept=${req.params.deptId};`;
    const ip = req.ip.split(":").pop();
    try {
    connection.query(sql, (err, results) => {
        if (err) console.log(err);
        res.send(JSON.stringify(results));
    });
    } catch (e) {
        console.log(e);
    }
});

router.get('/getip', function (req, res) {
    const ip = req.ip.split(":").pop();
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
        res.send(JSON.stringify({'ip': ip}));
});

router.get('/init', function (req, res) {
    const sql = 'SELECT * FROM users;';
    connection.query(sql, (err, results) => {
        if (err) console.log(err);
        res.send(JSON.stringify(results));
    });
});

module.exports = router;
