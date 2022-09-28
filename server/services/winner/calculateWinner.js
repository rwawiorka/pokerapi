import royalFlush from './rankings/royalFlush';
import straightFlush from './rankings/straightFlush';
import fourOfAKind from './rankings/fourOfAKind';
import fullHouse from './rankings/fullHouse';
import flush from './rankings/flush';
import straight from './rankings/straight';
import threeOfAKind from './rankings/threeOfAKind';
import twoPair from './rankings/twoPair';
import onePair from './rankings/onePair';
import highCard from './rankings/highCard';

import determineStraightFlushDraw from './draws/determineStraightFlushDraw';
import determineFourOfAKindDraw from './draws/determineFourOfAKindDraw';
import determineFullHouseDraw from './draws/determineFullHouseDraw';
import determineFlushDraw from './draws/determineFlushDraw';
import determineStraightDraw from './draws/determineStraightDraw';
import determineThreeOfAKindDraw from './draws/determineThreeOfAKindDraw';
import determineTwoPairDraw from './draws/determineTwoPairDraw';
import determineOnePairDraw from './draws/determineOnePairDraw';
import determineHighCardDraw from './draws/determineHighCardDraw';

import getHighestPlayersRank from './misc/getHighestPlayersRank';

export default function calculateWinner(req, res) {
    const playersReq = req.query.pl;
    const tableReq = req.query.t;

    const players = [];
    const playersObject = [];

    const playersToRoyalFlush = [];
    const playersToStraightFlush = [];
    const playersToFourOfAKind = [];
    const playersToFullHouse = [];
    const playersToFlush = [];
    const playersToStraight = [];
    const playersToThreeOfAKind = [];
    const playersToTwoPair = [];
    const playersToPair = [];

    let winners = [];
    for (let i = 0; i < playersReq.length; i++) {
        if ((players[i] = royalFlush(playersReq[i], tableReq)) != false) {
            playersToRoyalFlush.push(players[i]);
            playersObject.push(players[i].player);
        } else if ((players[i] = straightFlush(playersReq[i], tableReq)) != false) {
            playersToStraightFlush.push(players[i]);
            playersObject.push(players[i].player);
        } else if ((players[i] = fourOfAKind(playersReq[i], tableReq)) != false) {
            playersToFourOfAKind.push(players[i]);
            playersObject.push(players[i].player);
        } else if ((players[i] = fullHouse(playersReq[i], tableReq)) != false) {
            playersToFullHouse.push(players[i]);
            playersObject.push(players[i].player);
        } else if ((players[i] = flush(playersReq[i], tableReq)) != false) {
            playersToFlush.push(players[i]);
            playersObject.push(players[i].player);
        } else if ((players[i] = straight(playersReq[i], tableReq)) != false) {
            playersToStraight.push(players[i]);
            playersObject.push(players[i].player);
        } else if ((players[i] = threeOfAKind(playersReq[i], tableReq)) != false) {
            playersToThreeOfAKind.push(players[i]);
            playersObject.push(players[i].player);
        } else if ((players[i] = twoPair(playersReq[i], tableReq)) != false) {
            playersToTwoPair.push(players[i]);
            playersObject.push(players[i].player);
        } else if ((players[i] = onePair(playersReq[i], tableReq)) != false) {
            playersToPair.push(players[i]);
            playersObject.push(players[i].player);
        } else if ((players[i] = highCard(playersReq[i], tableReq)) != false) {
            playersObject.push(players[i].player);
        }
    }
    if (playersToRoyalFlush.length > 0) {
        winners = playersToRoyalFlush[0].player;
    } else if (playersToStraightFlush.length > 1) {
        winners = determineStraightFlushDraw(playersToStraightFlush);
    } else if (playersToStraightFlush.length > 0) {
        winners = playersToStraightFlush[0].player;
    } else if (playersToFourOfAKind.length > 1) {
        winners = determineFourOfAKindDraw(playersToFourOfAKind);
    } else if (playersToFourOfAKind.length > 0) {
        winners = playersToFourOfAKind[0].player;
    } else if (playersToFullHouse.length > 1) {
        winners = determineFullHouseDraw(playersToFullHouse);
    } else if (playersToFullHouse.length > 0) {
        winners = playersToFullHouse[0].player;
    } else if (playersToFlush.length > 1) {
        winners = determineFlushDraw(playersToFlush);
    } else if (playersToFlush.length > 0) {
        winners = playersToFlush[0].player;
    } else if (playersToStraight.length > 1) {
        winners = determineStraightDraw(playersToStraight);
    } else if (playersToStraight.length > 0) {
        winners = playersToStraight[0].player;
    } else if (playersToThreeOfAKind.length > 1) {
        winners = determineThreeOfAKindDraw(playersToThreeOfAKind);
    } else if (playersToThreeOfAKind.length > 0) {
        winners = playersToThreeOfAKind[0].player;
    } else if (playersToTwoPair.length > 1) {
        winners = determineTwoPairDraw(playersToTwoPair);
    } else if (playersToTwoPair.length > 0) {
        winners = playersToTwoPair[0].player;
    } else if (playersToPair.length > 1) {
        winners = determineOnePairDraw(playersToPair);
    } else if (playersToPair.length > 0) {
        winners = playersToPair[0].player;
    } else {
        if ((winners = getHighestPlayersRank(players)) == false) {
            winners = determineHighCardDraw(players);
        }
    }
    res.status(200).send(JSON.stringify({ winners: winners, players: playersObject }));
}