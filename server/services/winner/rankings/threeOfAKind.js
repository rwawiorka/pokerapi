import createCards from '../../../misc/createCards';
import Player from '../../../misc/Player';
import backCardsToString from '../misc/backCardsToString';

export default function threeOfAKind(playerCards = false, tableCards) {
    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards;
    if (playerCards) {
        tempPlayerTableCards = cards.playerCards;
    } else {
        tempPlayerTableCards = cards.tableCards;
    }
    const threePos = [];
    let hasThreeOfAKind = false;
    let rejectedPlayerCardsIndexes = [];
    let playerPower = 0;

    for (let i = 0; i < tempPlayerTableCards.length - 2; i++) {
        if ((tempPlayerTableCards[i].power == tempPlayerTableCards[i + 1].power) && (tempPlayerTableCards[i + 1].power == tempPlayerTableCards[i + 2].power)) {
            threePos.push(i);
            threePos.push(i + 1);
            threePos.push(i + 2);
        }
    }
    if (threePos.length > 3) {
        threePos.shift();
        threePos.shift();
        threePos.shift();
        hasThreeOfAKind = true;
    } else if (threePos.length < 3) {
        return false;
    } else {
        hasThreeOfAKind = true;
    }

    for (let i = 0; i < tempPlayerTableCards.length; i++) {
        if (threePos.includes(i))
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

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), threeOfAKind.name);

    return hasThreeOfAKind ? { player: player, playerPower: playerPower, playerCards: tempPlayerTableCards, result: threeOfAKind.name } : false;
}