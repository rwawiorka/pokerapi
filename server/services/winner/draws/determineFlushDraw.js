export default function determineFlushDraw(players) {
    const playersPower = [];
    const winners = [];
    let maxPower = players[0].playerPower;

    for (let i = 0; i < players.length; i++) {
        playersPower.push(players[i].playerPower);
        if (players[i].playerPower > maxPower) {
            maxPower = players[i].playerPower;
        }
    }
    let indexes = [],
        i = -1;
    while ((i = playersPower.indexOf(maxPower, i + 1)) != -1) {
        indexes.push(i);
    }

    if (indexes.length == 1) {
        winners.push(players[indexes[0]].player);
    } else {
        for (let i = 0; i < players.length; i++) {
            winners.push(players[indexes[i]].player);
        }
    }

    return winners;
}