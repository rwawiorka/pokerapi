import { preflop, afterflop, turn, river } from '../../misc/types';
import cards from '../../misc/cards';
import createCards from '../../misc/createCards';

import TooManyPlayersException from '../exceptions/common/TooManyPlayersException';
import CantDefineType from '../exceptions/predict/CantDefineType';

export default function prediction(req, res) {
    try {
        if (req.query.type === preflop) {
            predictPreflop(req, res);
        } else if (req.query.type === afterflop) {
            predictAfterflop(req, res);
        } else if (req.query.type === turn) {
            predictTurn(req, res);
        } else if (req.query.type === river) {
            predictRiver(req, res);
        } else {
            throw new CantDefineType();
        }
    } catch (error) {
        res.status(500).send(error.message, error.stack);
    }
}

function predictPreflop(req, res) {
    const playerCards = req.query.pl.split(',');
    const playerRank = [];
    const playerSuit = [];
    let playerProbability;
    let winningProbability;
    playerRank.push(playerCards[0].split("")[0]);
    playerRank.push(playerCards[1].split("")[0]);
    playerSuit.push(playerCards[0].split("")[1]);
    playerSuit.push(playerCards[1].split("")[1]);
    if (req.query.players === '2') {
        playerProbability = require('../../../misc/pokerOdds/preflop/pokerOddsTwoPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '3') {
        playerProbability = require('../../../misc/pokerOdds/preflop/pokerOddsThreePlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '4') {
        playerProbability = require('../../../misc/pokerOdds/preflop/pokerOddsFourPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '5') {
        playerProbability = require('../../../misc/pokerOdds/preflop/pokerOddsFivePlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '6') {
        playerProbability = require('../../../misc/pokerOdds/preflop/pokerOddsSixPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '7') {
        playerProbability = require('../../../misc/pokerOdds/preflop/pokerOddsSevenPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '8') {
        playerProbability = require('../../../misc/pokerOdds/preflop/pokerOddsEightPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '9') {
        playerProbability = require('../../../misc/pokerOdds/preflop/pokerOddsNinePlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '10') {
        playerProbability = require('../../../misc/pokerOdds/preflop/pokerOddsTenPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else {
        throw new TooManyPlayersException();
    }
    res.status(200).send({
        playerWinningProbability: winningProbability
    })
}

function predictAfterflop(req, res) {
    const playerCards = req.query.pl;
    const tableCards = req.query.t;
    checkForRoyalFlush(playerCards, tableCards);


}

function predictTurn(req, res) {

}

function predictRiver(req, res) {

}

function getPosibility(playerProb, playerRank, playerSuit) {
    if (playerSuit[0] === playerSuit[1]) {
        return playerProb.array[playerRank[0] + playerRank[1] + 's'];
    } else {
        return playerProb.array[playerRank[0] + playerRank[1]];
    }
}

function calcAfterFlopProbability(playerCards, tableCards) {


}

function checkForRoyalFlush(playerCards, tableCards) {
    const cards = createCards(playerCards, tableCards)['playerCardsTable'];
}

function checkForStraightFlush(playerCards, tableCards) {

}

function checkForFourOfAKind(playerCards, tableCards) {

}

function checkForFullHouse(playerCards, tableCards) {

}

function checkForFlush(playerCards, tableCards) {

}

function checkForStraight(playerCards, tableCards) {

}

function checkForThreeOfAKind(playerCards, tableCards) {

}

function checkForPair(playerCards, tableCards) {

}

function checkForOnePair(playerCards, tableCards) {

}