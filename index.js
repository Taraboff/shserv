const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8181;
const jsonParser = express.json();

app.use('/tel', express.static(__dirname + '/public' + '/tel'));
app.use('/lean', express.static(__dirname + '/public' + '/lean'));

// app.use(express.json());

app.get('/', (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.post('/sv', (req, res) => {
    // let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    // getClientAddress = function (req) {
    //     return req.ip.split(":").pop();
    // };
    // const ip = getClientAddress(req);
    // console.log(req.ip);
    res.sendFile(path.join(__dirname, 'data/tel', `${req.ip}.json`));
});

app.post('/save', jsonParser, (req, res) => {

    fs.writeFile(`data/tel/${req.ip}.json`, JSON.stringify(req.body), (err) => {
        if (err) {
            return console.log('Ошибка записи файла');
        }
    });
    res.json({message: `Данные сохранены в файл ${req.ip}.json`});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});