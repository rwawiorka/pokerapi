import createCards from '../../../misc/createCards';
import Player from '../../../misc/Player';
import backCardsToString from '../misc/backCardsToString';
import getUniqueListBy from '../misc/getUniqueListBy';

export default function straight(playerCards = false, tableCards) {
    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards;
    if (playerCards) {
        tempPlayerTableCards = cards.playerCards;
    } else {
        tempPlayerTableCards = cards.tableCards;
    }
    const straightPos = [];
    let hasStraight = false;
    let rejectedPlayerCardsIndexes = [];
    let playerPower = 0;

    tempPlayerTableCards = getUniqueListBy(tempPlayerTableCards, 'power');

    if (tempPlayerTableCards.length < 5) { return false; }

    if (tempPlayerTableCards[0].power == 2 &&
        tempPlayerTableCards[1].power == 3 &&
        tempPlayerTableCards[2].power == 4 &&
        tempPlayerTableCards[3].power == 5 &&
        tempPlayerTableCards[tempPlayerTableCards.length - 1].power == 14) {
        hasStraight = true;
        straightPos.push(0);
        straightPos.push(1);
        straightPos.push(2);
        straightPos.push(3);
        straightPos.push(tempPlayerTableCards.length - 1);
        tempPlayerTableCards[tempPlayerTableCards.length - 1].power = 1;
    } else {
        for (let i = 0; i < tempPlayerTableCards.length - 4; i++) {
            if (((tempPlayerTableCards[i].power + 1) == tempPlayerTableCards[i + 1].power) &&
                ((tempPlayerTableCards[i + 1].power + 1) == tempPlayerTableCards[i + 2].power) &&
                ((tempPlayerTableCards[i + 2].power + 1) == tempPlayerTableCards[i + 3].power) &&
                ((tempPlayerTableCards[i + 3].power + 1) == tempPlayerTableCards[i + 4].power)) {
                hasStraight = true;
                straightPos.push(i);
                straightPos.push(i + 1);
                straightPos.push(i + 2);
                straightPos.push(i + 3);
                straightPos.push(i + 4);
            }
        }
    }

    if (straightPos.length > 5) {
        for (let i = 0; i < 5; i++) {
            straightPos.shift();
        }
        hasStraight = true;
    } else if (straightPos.length < 5) {
        return false;
    } else {
        hasStraight = true;
    }

    for (let i = 0; i < tempPlayerTableCards.length; i++) {
        if (straightPos.includes(i))
            continue;
        if (rejectedPlayerCardsIndexes.length >= 2) {
            break;
        }
        rejectedPlayerCardsIndexes.push(i);
    }

    tempPlayerTableCards = tempPlayerTableCards.filter(function(value, index) {
        return rejectedPlayerCardsIndexes.indexOf(index) == -1;
    });

    tempPlayerTableCards.forEach(x => playerPower += x.power);

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), straight.name);

    return hasStraight ? { player: player, playerPower: playerPower, playerCards: tempPlayerTableCards, result: straight.name } : false;
}