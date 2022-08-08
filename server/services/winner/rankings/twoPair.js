import createCards from '../../../misc/createCards';
import Player from '../../../misc/Player';
import backCardsToString from '../misc/backCardsToString';

export default function twoPair(playerCards = false, tableCards) {
    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards;
    if (playerCards) {
        tempPlayerTableCards = cards.playerCards;
    } else {
        tempPlayerTableCards = cards.tableCards;
    }
    const pairPos = [];
    let hasTwoPair = false;
    let rejectedPlayerCardsIndexes = [];
    let playerPower = 0;


    for (let i = 0; i < tempPlayerTableCards.length - 1; i++) {
        if (tempPlayerTableCards[i].power == tempPlayerTableCards[i + 1].power) {
            pairPos.push(i);
            pairPos.push(i + 1);
        }
    }
    if (pairPos.length != 4)
        return false;
    else
        hasTwoPair = true;

    for (let i = 0; i < tempPlayerTableCards.length; i++) {
        if (pairPos.includes(i))
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

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), twoPair.name);

    return hasTwoPair ? { player: player, playerPower: playerPower, playerCards: tempPlayerTableCards, result: twoPair.name } : false;
}