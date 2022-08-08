export default function determineHighCardDraw(players) {
    const indexes = [];
    const winners = [];
    let max = players[0].playerPower;
    for (let i = 1; i < players.length; i++) {
        if (max < players[i].playerPower) {
            max = players[i].playerPower;
        }
    }

    for (let i = 0; i < players.length; i++) {
        if (players[i].playerPower == max) {
            indexes.push[i];
            winners.push(players[i].player);
        }
    }

    return winners;
}