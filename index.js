const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const telRoutes = require('./routes/tel');
const leanRoutes = require('./routes/leanRoute');

const PORT = process.env.PORT || 8181;

app.use('/tel', express.static(__dirname + '/public' + '/tel'));
app.use('/lean', express.static(__dirname + '/public' + '/lean'));
app.use('/libs', express.static(__dirname + '/public' + '/libs'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(telRoutes);
app.use(leanRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
    res.status(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});