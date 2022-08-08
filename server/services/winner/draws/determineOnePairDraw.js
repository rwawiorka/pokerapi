export default function determineOnePairDraw(players) {
    const playersPairs = [];
    const winners = [];

    for (let i = 0; i < players.length; i++) {
        playersPairs[i] = [];
    }

    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players[i].playerCards.length - 1; j++) {
            if (players[i].playerCards[j].power == players[i].playerCards[j + 1].power) {
                playersPairs[i].push(players[i].playerCards[j]);
                playersPairs[i].push(players[i].playerPower);
                break;
            }
        }
    }

    let maxPlayerPower = players[0].playerPower;
    let maxPairPower = playersPairs[0].power;
    winners.push(players[0].player);
    for (let i = 1; i < playersPairs.length; i++) {
        if (maxPairPower < playersPairs[i].power) {
            if (maxPlayerPower < players[i].playerPower) {
                winners.shift();
                winners.push(players[i].player);
            }
        } else if (maxPairPower == playersPairs[i].power) {
            if (maxPlayerPower < players[i].playerPower) {
                winners.shift();
                winners.push(players[i].player);
            } else if (maxPlayerPower == players[i].playerPower) {
                winners.push(players[i].player);
            }
        }
    }

    return winners;
}