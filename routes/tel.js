const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const jsonParser = express.json();

router.post('/init', (req, res) => {
    const ip = req.ip.split(":").pop();

    fs.stat(`data/tel/${ip}.json`, function(err, stat) {
        if(err == null) {
            // для данного ip-адреса существует файл сохранения:
            res.sendFile(path.join(__dirname, '../data/tel', `${ip}.json`));
        } else if(err.code == 'ENOENT') {
            // для данного ip-адреса нет файла сохранения, отдаем файл-шаблон:
            res.sendFile(path.join(__dirname, '../data/tel', `data.json`));
        } else {
            console.log('Прочие причины ошибок: ', err.code);
        }
    });
});

router.post('/save', jsonParser, (req, res) => {   
    const ip = req.ip.split(':').pop();

    fs.writeFile(`data/tel/${ip}.json`, JSON.stringify(req.body), (err) => {
        if (err) {
            return console.error(err);
        }
    });
    res.json({message: `Данные сохранены в файл ${ip}.json`});
});

module.exports = router;