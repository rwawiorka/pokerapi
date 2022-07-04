var express = require('express');
var router = express.Router();

const { predictChances } = require('../controllers/predictChecker');

router.get('/', function(req, res, next) {
    res.set({
        'Content-Type': 'application/json; charset=utf-8'
    });
    predictChances(req, res);
});

router.use((req, res) => res.status(404).json({ message: 'Cant find method in this endpoint' }));

module.exports = router;