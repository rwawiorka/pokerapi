import straightFlush from './straightFlush';

export default function royalFlush(playerCards = false, tableCards) {
    let playerStraightFlush;
    let hasRoyalFlush = false;

    if ((playerStraightFlush = straightFlush(playerCards, tableCards)) != false) {
        if ((playerStraightFlush.playerCards[4].power == 14) &&
            (playerStraightFlush.playerCards[0].power == 10)) {
            hasRoyalFlush = true;
        }
    }
    if (hasRoyalFlush == false) {
        return false;
    }

    playerStraightFlush.player.result = 'royalFlush';

    return hasRoyalFlush ? { player: playerStraightFlush.player, playerPower: playerStraightFlush.playerPower, playerCards: playerStraightFlush.playerCards, result: royalFlush.name } : false;
}