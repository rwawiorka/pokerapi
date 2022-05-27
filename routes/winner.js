var express = require('express');
var router = express.Router();

const { getWinner } = require('../controllers/winnerChecker');

/* GET users listing. */
router.get('/', function(req, res, next) {
    getWinner(req, res);
});

router.use((req, res) => res.status(404).json({ message: 'Cant find method in this endpoint' }));

module.exports = router;