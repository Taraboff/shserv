const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
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
            'о': 'o', 'п': 'p', 'р': 'r','с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
            'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh','ъ': space,
            'ы': 'y', 'ь': space, 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        let translate = function(v) {   // функция транслитерации
            if (/[а-яё]/.test(v)) {
                link = translitArray[v] ;
            } else if (/[a-z0-9]/.test(v)) {
                link = v;
            } else {
                if (link.slice(-1) !== space) link = space;
            }
            return link;
        }
        let translitName = Array.from(name, (v) => translate(v) ).join('');

        cb(null, translitName + ext);
    }
});
const fileFilter = (req, file, cb) => {

  const allowedFileTypes = ["image/jpeg", "image/jpeg", "image/png", "application/pdf"];

    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else{
        cb(null, false);
    }
 }
const upload = multer({storage:storageConfig, fileFilter });


router.post('/upload', upload.single("uploadfile"), function (req, res, next) {
    
    if(!req.file)
        res.send("Ошибка при загрузке файла");
    else
        res.send(`Файл ${req.file.originalname} загружен`);

});

module.exports = router;
