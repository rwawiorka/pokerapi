const colors = require('../misc/colors');
const ranks = require('../misc/ranks');

class Card {
    constructor(power, suit) {
        this.power = getPower(power);
        this.suit = getSuit(suit);
    }
    getCardByPower(power) {
        if (power == 1)
            return 'A';
        return ranks.getTypeByRank(power);
    }

    getCardBySuit(suit) {
        return colors.getTypeByColor(suit);
    }
}

function getPower(power) {
    return ranks.getRank(power);
}

function getSuit(suit) {
    return colors.getColor(suit);
}

module.exports = Card;