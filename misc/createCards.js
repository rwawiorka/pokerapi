const Card = require("./Card");

module.exports = function(playerCards, tableCards) {
    const tableCardsSplit = tableCards.split(',');
    const tempTableCards = []
    const tempPlayerCards = [];
    let tempPlayerCardsSplitted;
    let tempPlayerTableCards = [];
    if (playerCards) {
        tempPlayerCardsSplitted = playerCards.split(',');
    }

    for (let i = 0; i < tableCardsSplit.length; i++) {
        tempTableCards.push(new Card(tableCardsSplit[i].toUpperCase().charAt(0), tableCardsSplit[i].toUpperCase().charAt(1)));
    }
    if (playerCards) {
        tempPlayerCards.push(new Card(tempPlayerCardsSplitted[0].toUpperCase().charAt(0), tempPlayerCardsSplitted[0].toUpperCase().charAt(1)));
        tempPlayerCards.push(new Card(tempPlayerCardsSplitted[1].toUpperCase().charAt(0), tempPlayerCardsSplitted[1].toUpperCase().charAt(1)));

        tempPlayerTableCards = tempPlayerCards.concat(tempTableCards);

        tempPlayerTableCards.sort((a, b) => {
            if (a.power > b.power) return 1;
            if (a.power < b.power) return -1;
            return 0;
        });
    }
    return { playerCards: tempPlayerTableCards, tableCards: tempTableCards, playerCardsTable: tempPlayerCards };
}