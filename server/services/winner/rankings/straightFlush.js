import createCards from '../../../misc/createCards';
import straight from './straight';
import flush from './flush';

export default function straightFlush(playerCards = false, tableCards) {

    const cards = createCards(playerCards, tableCards);
    let hasStraightFlush = false;
    let playerStraight;
    let playerFlush;

    if ((playerStraight = straight(playerCards, tableCards))) {
        if ((playerFlush = flush(playerStraight.player.cards, tableCards))) {
            hasStraightFlush = true;
        }
    }

    if (hasStraightFlush == false) { return false; }

    playerFlush.player.result = 'straightFlush';
    return hasStraightFlush ? { player: playerFlush.player, playerPower: playerFlush.playerPower, playerCards: playerFlush.playerCards, result: straightFlush.name } : false;
}