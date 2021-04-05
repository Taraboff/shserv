const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const gm = require('gm');
const path = require('path');
const mysql = require('mysql2');
let newName, errMsg;

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
        errMsg = 'Неверный тип документа';
        cb(null, false);
    }
}
const upload = multer({ storage: storageConfig, fileFilter });

router.get('/loadimage', function(req, res, next) {
    const pt = path.join(__dirname, '../uploads', '0211.jpg');
    const pt2 = path.join(__dirname, '../uploads', '0211.png');

    gm(pt)
    .resize(320, 240, '!')
    .write(pt2, function (err) {
        if (!err) console.log('File converting...');
      });
    res.send('Resizing image done!');
});

router.post('/upload', upload.single("uploadfile"), function (req, res, next) {
    const uploadMsg = {};
    if (!req.file)
        uploadMsg.msg = `Ошибка при загрузке файла. ${errMsg}`;
    else {
        uploadMsg.msg = `Файл ${req.file.originalname} загружен в каталог /uploads`;
        uploadMsg.file = newName;

        //  запись в БД имени файла
        // const sql_insert = `INSERT stends(dept, version, ${req.body.pocket}) VALUES (${req.body.deptId}, '${req.body.stend}', '${newName}');`;
        const sql = `UPDATE stends SET ${req.body.pocket}='${newName}' WHERE dept=${req.body.deptId} AND version='${req.body.stend}';`;
        console.log('sql: ', sql);

        try {
            connection.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                } 
                
            });
            } catch (e) {
                console.log(e);
            }
        // После загрузки файла в /uploads и сохранения в БД 
        // создать миниатюру в случае если было загружено изображение
        

    }

    res.send(JSON.stringify(uploadMsg));
});

router.get('/getstends/:deptId', function (req, res) {
    const sql = `SELECT * FROM stends WHERE dept=${req.params.deptId};`;

    try {
    connection.query(sql, (err, results) => {
        if (err) console.log(err);
        res.send(JSON.stringify(results));
    });
    } catch (e) {
        console.log(e);
    }

});

router.get('/init', function (req, res) {

    const sql = 'SELECT * FROM users;';
    
    connection.query(sql, (err, results) => {
        
        if (err) console.log(err);
        res.send(JSON.stringify(results));

    });
    

    // чтение из файла 
    // try {
    //     fs.readFile('data/lean/stends.json', 'utf8', (err, stendData) => {
    //         res.send(JSON.stringify(stendData));
    //     });

    // } catch (e) {
    //     console.log('Ошибка чтения файла stends.json');
    // }
});

module.exports = router;
