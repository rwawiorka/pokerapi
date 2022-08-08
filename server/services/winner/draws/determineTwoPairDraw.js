export default function determineTwoPairDraw(players) {
    const playersPairs = [];
    const winners = [];

    for (let i = 0; i < players.length; i++) {
        playersPairs[i] = [];
    }

    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players[i].playerCards.length - 1; j++) {
            if (players[i].playerCards[j].power == players[i].playerCards[j + 1].power) {
                playersPairs[i].push(players[i].playerCards[j]);
            }
        }
    }

    const playersBestCard = [];

    for (let i = 0; i < playersPairs.length; i++) {
        playersBestCard.push(Math.max(...playersPairs[i].map(playerCard => playerCard.power)));
    }

    const maxPlayerPower = Math.max(...playersBestCard);

    let indexes = [],
        i = -1;
    while ((i = playersBestCard.indexOf(maxPlayerPower, i + 1)) != -1) {
        indexes.push(i);
    }

    if (indexes.length == 1) {
        winners.push(players[indexes[0]].player)
        return winners;
    } else {
        const playersBestSecondCards = [];

        for (let i = 0; i < playersPairs.length; i++) {
            playersBestSecondCards.push(Math.min(...playersPairs[i].map(playerCard => playerCard.power)));
        }

        const maxPlayerSecondPower = Math.max(...playersBestSecondCards);

        let indexes = [],
            i = -1;
        while ((i = playersBestSecondCards.indexOf(maxPlayerSecondPower, i + 1)) != -1) {
            indexes.push(i);
        }
        if (indexes.length == 1) {
            winners.push(players[indexes[0]].player);
            return winners;
        } else {
            for (let i = 0; i < players.length; i++) {
                winners.push(players[i].player);
            }
            return winners;
        }
    }
}