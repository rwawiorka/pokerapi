import createCards from '../../../misc/createCards';
import Player from '../../../misc/Player';
import backCardsToString from '../misc/backCardsToString';

export default function fourOfAKind(playerCards = false, tableCards) {
    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards;
    if (playerCards) {
        tempPlayerTableCards = cards.playerCards;
    } else {
        tempPlayerTableCards = cards.tableCards;
    }
    let hasFourOfAKind = false;
    const fourPos = [];
    let rejectedPlayerCardsIndexes = [];
    let playerPower = 0;

    for (let i = 0; i < tempPlayerTableCards.length - 3; i++) {
        if ((tempPlayerTableCards[i].power == tempPlayerTableCards[i + 1].power) &&
            (tempPlayerTableCards[i + 1].power == tempPlayerTableCards[i + 2].power) &&
            (tempPlayerTableCards[i + 2].power == tempPlayerTableCards[i + 3].power)) {
            hasFourOfAKind = true;
            fourPos.push(i);
            fourPos.push(i + 1);
            fourPos.push(i + 2);
            fourPos.push(i + 3);
        }
    }

    if (hasFourOfAKind == false) { return false; }

    if (fourPos.length > 4) {
        const fourPosLength = fourPos.length;
        for (let i = 0; i < fourPosLength - 4; i++) {
            fourPos.shift();
        }
    }

    for (let i = 0; i < tempPlayerTableCards.length; i++) {
        if (fourPos.includes(i)) {
            continue;
        }
        if (rejectedPlayerCardsIndexes.length >= 2) {
            break;
        }
        rejectedPlayerCardsIndexes.push(i);
    }

    tempPlayerTableCards = tempPlayerTableCards.filter(function(value, index) {
        return rejectedPlayerCardsIndexes.indexOf(index) == -1;
    });

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), fourOfAKind.name);

    return hasFourOfAKind ? { player: player, playerPower: playerPower, playerCards: tempPlayerTableCards, result: fourOfAKind.name } : false;
}