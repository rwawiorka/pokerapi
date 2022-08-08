import createCards from '../../../misc/createCards';
import Player from '../../../misc/Player';
import backCardsToString from '../misc/backCardsToString';

export default function fullHouse(playerCards = false, tableCards) {
    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards;
    if (playerCards) {
        tempPlayerTableCards = cards.playerCards;
    } else {
        tempPlayerTableCards = cards.tableCards;
    }
    let hasFullHouse = false;
    const threePos = [];
    const pairPos = [];
    let threesCardPower;
    let rejectedPlayerCardsIndexes = [];
    let playerPower = 0;

    for (let i = 0; i < tempPlayerTableCards.length - 2; i++) {
        if ((tempPlayerTableCards[i].power == tempPlayerTableCards[i + 1].power) && (tempPlayerTableCards[i + 1].power == tempPlayerTableCards[i + 2].power)) {
            threePos.push(i);
            threePos.push(i + 1);
            threePos.push(i + 2);
            threesCardPower = tempPlayerTableCards[i].power;
            for (let j = 0; j < tempPlayerTableCards.length - 1; j++) {
                if ((tempPlayerTableCards[j].power == tempPlayerTableCards[j + 1].power) && (tempPlayerTableCards[j].power != threesCardPower)) {
                    pairPos.push(j);
                    pairPos.push(j + 1);
                    hasFullHouse = true;
                }
            }
        }
    }

    if (hasFullHouse == false) { return false; }

    if (threePos.length > 3) {
        const threePosLength = threePos.length;
        for (let i = 0; i < threePosLength - 3; i++) {
            threePos.shift();
        }
    }

    if (pairPos.length > 2) {
        const pairPosLength = pairPos.length;
        for (let i = 0; i < pairPosLength - 2; i++) {
            pairPos.shift();
        }
    }

    for (let i = 0; i < tempPlayerTableCards.length; i++) {
        if (threePos.includes(i) || pairPos.includes(i)) {
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

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), fullHouse.name);

    return hasFullHouse ? { player: player, playerPower: playerPower, playerCards: tempPlayerTableCards, result: fullHouse.name } : false;
}