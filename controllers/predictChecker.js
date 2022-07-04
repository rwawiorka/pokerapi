const { prediction } = require('../services/predict/prediction');
const types = require('../misc/types');

const NotEnoughPlayersException = require('../services/exceptions/common/NotEnoughPlayersException');
const NoCardsRepeatException = require('../services/exceptions/common/NoCardsRepeatException');
const TooManyPlayersException = require('../services/exceptions/common/TooManyPlayersException');
const NoProperCardsGivenException = require('../services/exceptions/common/NoProperCardsGivenException');
const CantDefineType = require('../services/exceptions/predict/CantDefineType');

exports.predictChances = (req, res) => {
    try {
        if (!req.query.type || (req.query.type != types.preflop && req.query.type != types.afterflop && req.query.type && types.turn && req.query.type != types.river)) {
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