import { prediction } from '../services/predict/prediction';
import { preflop, afterflop, turn, river } from '../misc/types';

import NotEnoughPlayersException from '../services/exceptions/common/NotEnoughPlayersException';
import NoCardsRepeatException from '../services/exceptions/common/NoCardsRepeatException';
import TooManyPlayersException from '../services/exceptions/common/TooManyPlayersException';
import NoProperCardsGivenException from '../services/exceptions/common/NoProperCardsGivenException';
import CantDefineType from '../services/exceptions/predict/CantDefineType';

export function predictChances(req, res) {
    try {
        if (!req.query.type || (req.query.type != preflop && req.query.type != afterflop && req.query.type && turn && req.query.type != river)) {
            throw new CantDefineType();
        } else if (!req.query.players || req.query.players < 2) {
            throw new NotEnoughPlayersException();
        } else if (req.query.players > 10) {
            throw new TooManyPlayersException();
        } else if (!req.query.pl || req.query.pl.length != 5) {
            throw new NoProperCardsGivenException();
        } else {
            const cardsSplitted = req.query.pl.split(",");
            if (cardsSplitted[0] === cardsSplitted[1]) {
                throw new NoCardsRepeatException();
            }
        }
        prediction(req, res);
    } catch (error) {
        res.status(404).send(JSON.stringify({ "error": error.name, "message": error.message }));
    }
}