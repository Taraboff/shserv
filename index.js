const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8181;
const jsonParser = express.json();

app.use('/tel', express.static(__dirname + '/public' + '/tel'));
app.use('/lean', express.static(__dirname + '/public' + '/lean'));
app.disable('X-Powered-By');
// app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
    res.status(200);
});
app.post('/sv', (req, res) => {
    // let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    getClientAddress = req => req.ip.split(":").pop();
    
    const ip = getClientAddress(req);

    fs.stat(`data/tel/${ip}.json`, function(err, stat) {
        if(err == null) {
            // для данного ip-адреса существует файл сохранения
            res.sendFile(path.join(__dirname, 'data/tel', `${ip}.json`));
        } else if(err.code == 'ENOENT') {
            // для данного ip-адреса нет файла сохранения, отдаем файл-шаблон
            res.sendFile(path.join(__dirname, 'data/tel', `data.json`));
        } else {
            console.log('Прочие причины ошибок: ', err.code);
        }
    });

});

app.post('/save', jsonParser, (req, res) => {
    const ip = req.ip.split(':').pop();

    fs.writeFile(`data/tel/${ip}.json`, JSON.stringify(req.body), (err) => {
        if (err) {
            return console.log('Ошибка записи файла');
        }
    });
    res.json({message: `Данные сохранены в файл ${ip}.json`});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});