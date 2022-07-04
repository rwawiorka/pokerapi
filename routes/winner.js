var express = require('express');
var router = express.Router();

const { getWinner } = require('../controllers/winnerChecker');

router.get('/', function(req, res, next) {
    res.set({
        'Content-Type': 'application/json; charset=utf-8'
    });
    getWinner(req, res);
});

router.use((req, res) => res.status(404).json({ message: 'Cant find method in this endpoint' }));

module.exports = router;