import mode from '../misc/mode';

export default function determineFullHouseDraw(players) {
    const mostRepeatedPlayersCards = [];
    const leastRepeatedPlayersCards = [];
    const winners = [];

    for (let i = 0; i < players.length; i++) {
        mostRepeatedPlayersCards.push(mode(players[i].playerCards, 'most').power);
        leastRepeatedPlayersCards.push(mode(players[i].playerCards, 'least').power);
    }

    const maxMostRepeatedPower = Math.max(...mostRepeatedPlayersCards);
    const maxLeastRepeatedPower = Math.max(...leastRepeatedPlayersCards);

    let indexes = [],
        i = -1;
    while ((i = mostRepeatedPlayersCards.indexOf(maxMostRepeatedPower, i + 1)) != -1) {
        indexes.push(i);
    }

    if (indexes.length == 1) {
        winners.push(players[indexes[0]].player);
    } else {
        let indexes = [],
            i = -1;
        while ((i = leastRepeatedPlayersCards.indexOf(maxLeastRepeatedPower, i + 1)) != -1) {
            indexes.push(i);
        }
        if (indexes.length == 1) {
            winners.push(players[indexes[0]].player);
        } else {
            for (let i = 0; i < players.length; i++) {
                winners.push(players[i].player);
            }
        }
    }

    return winners;
}