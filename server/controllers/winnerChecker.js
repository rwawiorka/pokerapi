import calculateWinner from '../services/winner/calculateWinner';

import pokerCards from '../misc/cards';

import NoProperTableGivenException from '../services/exceptions/winner/NoProperTableGivenException';
import NotEnoughPlayersException from '../services/exceptions/common/NotEnoughPlayersException';
import NotEnoughCardsException from '../services/exceptions/common/NotEnoughCardsException';
import NoCardsRepeatException from '../services/exceptions/common/NoCardsRepeatException';
import NoProperCardsGivenException from '../services/exceptions/common/NoProperCardsGivenException';
import TooManyPlayersException from '../services/exceptions/common/TooManyPlayersException';

export function getWinner(req, res) {
    try {
        if (!req.query.pl || req.query.pl.length < 2) { // query.pl.length < 2 means too few players
            throw new NotEnoughPlayersException();
        } else if (req.query.pl.length > 10) { // query.pl.length > 10 means too many players
            throw new TooManyPlayersException();
        } else if (!req.query.t || req.query.t.length < 14) { // query.pl.length < 14 means too few deck cards
            throw new NoProperTableGivenException();
        } else if (Array.isArray(req.query.pl)) {
            let playersCardsArray = [];
            for (let i = 0; i < req.query.pl.length; i++) {
                playersCardsArray.push(req.query.pl[i].split(','));
                if (req.query.pl[i].length < 5) { // every player should have 2 cards (ex. KH,KC)
                    throw new NotEnoughCardsException();
                }
            }

            const tableCardsTemp = req.query.t.split(',');
            const tableCards = [...new Set(tableCardsTemp)];
            const playersCards = [...new Set(playersCardsArray.flat())];

            if (tableCards.length < 5 || (playersCards.length) < (req.query.pl.length * 2)) {
                throw new NoCardsRepeatException();
            }

            const combinedCards = [...new Set([...tableCards, ...playersCards])];

            if (combinedCards.length < tableCards.length + playersCards.length) {
                throw new NoCardsRepeatException();
            }

            const combinedCardsUppercased = combinedCards.map(card => card.toUpperCase());

            const allCards = [...new Set([...combinedCardsUppercased, ...pokerCards])];
            if (allCards.length > 52) {
                throw new NoProperCardsGivenException();
            }
        }
        calculateWinner(req, res);
    } catch (error) {
        res.status(404).send(JSON.stringify({ "error": error.name, "message": error.message, "stack": error.stack }));
    }
}