import createCards from '../../../misc/createCards';
import Player from '../../../misc/Player';
import backCardsToString from '../misc/backCardsToString';

export default function highCard(playerCards = false, tableCards) {
    const cardsCreated = createCards(playerCards, tableCards);
    const tempPlayerTableCards = cardsCreated.playerCards;
    let playerPower = 0;

    tempPlayerTableCards.shift();
    tempPlayerTableCards.shift();
    tempPlayerTableCards.forEach(x => playerPower += x.power);

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), highCard.name);

    return {
        player: player,
        playerPower: playerPower,
        playerCards: tempPlayerTableCards,
        result: highCard.name
    };
}