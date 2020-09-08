const express = require('express');
const router = express.Router();
const admin = require('../database');
const db = admin.database();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/', isNotLoggedIn, (req, res) => {
    res.render('index');
});

module.exports = router;