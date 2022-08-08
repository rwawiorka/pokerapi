export default function determineThreeOfAKindDraw(players) {
    const playersThrees = [];
    const winners = [];

    for (let i = 0; i < players.length; i++) {
        playersThrees[i] = [];
    }

    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players[i].playerCards.length - 2; j++) {
            if ((players[i].playerCards[j].power == players[i].playerCards[j + 1].power) &&
                (players[i].playerCards[j + 1].power == players[i].playerCards[j + 2].power)) {
                playersThrees[i].push(players[i].playerCards[j]);
                playersThrees[i].push(players[i].playerPower);
            }
        }
    }

    let maxPlayerPower = players[0].playerPower;
    let maxThreePower = playersThrees[0].power;
    winners.push(players[0].player);
    for (let i = 1; i < players.length; i++) {
        if (maxThreePower < playersThrees[i].power) {
            if (maxPlayerPower < players[i].playerPower) {
                winners.shift();
                winners.push(players[i].player);
            }
        } else if (maxThreePower == playersThrees[i].power) {
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