const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
  
    if(file.mimetype === "image/jpeg" || 
    file.mimetype === "image/jpg"|| 
    file.mimetype === "application/pdf"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
 }
const upload = multer({storage:storageConfig, fileFilter });


router.post('/upload', upload.single("uploadfile"), function (req, res, next) {
    let filedata = req.file;
    console.log(filedata);
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else
        res.send(`Файл ${req.file.originalname} загружен`);

});

module.exports = router;
