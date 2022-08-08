import { Router } from 'express';
var router = Router();

import { getWinner } from '../controllers/winnerChecker';

router.get('/', function(req, res, next) {
    res.set({
        'Content-Type': 'application/json; charset=utf-8'
    });
    getWinner(req, res);
});

router.use((req, res) => res.status(404).json({ message: 'Cant find method in this endpoint' }));

export default router;