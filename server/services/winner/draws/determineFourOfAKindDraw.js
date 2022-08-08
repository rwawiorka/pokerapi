import mode from '../misc/mode';

export default function determineFourOfAKindDraw(players) {
    const mostRepeatedPlayersCardsPower = [];
    const mostRepeatedPlayersCards = [];
    const winners = [];
    let maxRepeatedPower = 0;

    for (let i = 0; i < players.length; i++) {
        mostRepeatedPlayersCardsPower[i] = [];
        for (let j = 0; j < players[i].playerCards.length; j++) {
            mostRepeatedPlayersCardsPower[i].push(players[i].playerCards[j].power);
        }
    }
    for (let i = 0; i < players.length; i++) {
        mostRepeatedPlayersCards.push(mode(mostRepeatedPlayersCardsPower[i], 'most'));
    }

    maxRepeatedPower = Math.max(...mostRepeatedPlayersCards);
    let indexes = [],
        i = -1;
    while ((i = mostRepeatedPlayersCards.indexOf(maxRepeatedPower, i + 1)) != -1) {
        indexes.push(i);
    }
    if (indexes.length == 1) {
        winners.push(players[indexes[0]].player);
    } else {
        for (let i = 0; i < players.length; i++) {
            winners.push(players[i].player);
        }
    }

    return winners;
}