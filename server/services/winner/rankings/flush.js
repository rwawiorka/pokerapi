import createCards from '../../../misc/createCards';
import Player from '../../../misc/Player';
import backCardsToString from '../misc/backCardsToString';

export default function flush(playerCards = false, tableCards) {
    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards;
    if (playerCards) {
        tempPlayerTableCards = cards.playerCards;
    } else {
        tempPlayerTableCards = cards.tableCards;
    }
    let hasFlush = false;
    const diamondsPos = [];
    const spadesPos = [];
    const heartsPos = [];
    const clubsPos = [];
    let rejectedPlayerCardsIndexes = [];
    let playerPower = 0;
    let flushColor;

    for (let i = 0; i < tempPlayerTableCards.length; i++) {
        const card = tempPlayerTableCards[i];
        switch (card.suit) {
            case 'Diamonds':
                diamondsPos.push(i);
                break;
            case 'Spades':
                spadesPos.push(i);
                break;
            case 'Hearts':
                heartsPos.push(i);
                break;
            case 'Clubs':
                clubsPos.push(i);
                break;
        }
    }

    if (diamondsPos.length >= 5) {
        hasFlush = true;
        flushColor = 'diamonds';
    } else if (spadesPos.length >= 5) {
        hasFlush = true;
        flushColor = 'spades';
    } else if (heartsPos.length >= 5) {
        hasFlush = true;
        flushColor = 'hearts';
    } else if (clubsPos.length >= 5) {
        hasFlush = true;
        flushColor = 'clubs';
    } else {
        return hasFlush = false;
    }

    function rejectUnnecessaryCards(pos) {
        for (let i = 0; i < tempPlayerTableCards.length; i++) {
            if (pos.includes(i)) {
                continue;
            }
            if (rejectedPlayerCardsIndexes.length >= 2) {
                break;
            }
            rejectedPlayerCardsIndexes.push(i);
        }
    }

    switch (flushColor) {
        case 'diamonds':
            rejectUnnecessaryCards(diamondsPos);
            break;
        case 'spades':
            rejectUnnecessaryCards(spadesPos);
            break;
        case 'hearts':
            rejectUnnecessaryCards(heartsPos);
            break;
        case 'clubs':
            rejectUnnecessaryCards(clubsPos);
            break;
    }

    tempPlayerTableCards = tempPlayerTableCards.filter(function(value, index) {
        return rejectedPlayerCardsIndexes.indexOf(index) == -1;
    });

    if (tempPlayerTableCards.length > 5) {
        const tempPlayerTableCardsLength = tempPlayerTableCards.length;
        for (let i = 0; i < tempPlayerTableCardsLength - 5; i++) {
            tempPlayerTableCards.shift();
        }
    }

    tempPlayerTableCards.forEach(x => playerPower += x.power);

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), flush.name);

    return hasFlush ? { player: player, playerPower: playerPower, playerCards: tempPlayerTableCards, result: flush.name } : false;
}