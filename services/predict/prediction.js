const types = require('../../misc/types');

const TooManyPlayersException = require('../exceptions/common/TooManyPlayersException');
const CantDefineType = require('../exceptions/predict/CantDefineType');

exports.prediction = (req, res) => {
    try {
        if (req.query.type === types.preflop) {
            predictPreflop(req, res);
        } else if (req.query.type === types.afterflop) {
            predictAfterflop(req, res);
        } else if (req.query.type === types.turn) {
            predictTurn(req, res);
        } else if (req.query.type === types.river) {
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
        playerProbability = require('../../misc/pokerOdds/pokerOddsTwoPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '3') {
        playerProbability = require('../../misc/pokerOdds/pokerOddsThreePlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '4') {
        playerProbability = require('../../misc/pokerOdds/pokerOddsFourPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '5') {
        playerProbability = require('../../misc/pokerOdds/pokerOddsFivePlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '6') {
        playerProbability = require('../../misc/pokerOdds/pokerOddsSixPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '7') {
        playerProbability = require('../../misc/pokerOdds/pokerOddsSevenPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '8') {
        playerProbability = require('../../misc/pokerOdds/pokerOddsEightPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '9') {
        playerProbability = require('../../misc/pokerOdds/pokerOddsNinePlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '10') {
        playerProbability = require('../../misc/pokerOdds/pokerOddsTenPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else {
        throw new TooManyPlayersException();
    }
    res.status(200).send({
        playerWinningProbability: winningProbability
    })
}

function predictAfterflop(req, res) {
    const playerCards = req.query.pl.split(",");
    const playerRank = [];
    const playerSuit = [];
    let playerProbability;
    let winningProbability;
    playerRank.push(playerCards[0].split("")[0]);
    playerRank.push(playerCards[1].split("")[0]);
    playerSuit.push(playerCards[0].split("")[1]);
    playerSuit.push(playerCards[1].split("")[1]);

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