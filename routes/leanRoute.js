const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/upload', (req, res) => {
    const ip = req.ip.split(":").pop();
    res.redirect('/lean');

});

module.exports = router;
