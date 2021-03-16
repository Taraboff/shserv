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

app.use(multer({storage:storageConfig}).single("filedata"));
app.post("/upload", function (req, res, next) {
   
    let filedata = req.file;
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else
        res.send("Файл загружен");
});

router.post('/upload', (req, res) => {
    const ip = req.ip.split(":").pop();
    res.redirect('/lean');

});

module.exports = router;
