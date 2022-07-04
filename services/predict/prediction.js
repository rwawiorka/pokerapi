const types = require('../../misc/types');

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
            res.status(400).send({
                message: 'Invalid request'
            });
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
    console.log(req.query.players);
    console.log(typeof(req.query.players));
    if (req.query.players === '2') {
        playerProbability = require('../../misc/pokerOddsTwoPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.players === '3') {
        playerProbability = require('../../misc/pokerOddsThreePlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else if (req.query.player === '4') {
        playerProbability = require('../../misc/pokerOddsFourPlayers');
        winningProbability = getPosibility(playerProbability, playerRank, playerSuit);
    } else {
        res.status(500).send({
            message: 'Too many players'
        });
    }
    res.status(200).send({
        playerWinningProbability: winningProbability
    })
}

function predictAfterflop(req, res) {

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