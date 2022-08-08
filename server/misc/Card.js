import { colors, getTypeByColor, getColor } from '../misc/colors';
import { ranks, getTypeByRank, getRank } from '../misc/ranks';

class Card {
    constructor(power, suit) {
        this.power = getPower(power);
        this.suit = getSuit(suit);
    }
    getCardByPower(power) {
        if (power == 1)
            return 'A';
        return getTypeByRank(power);
    }

    getCardBySuit(suit) {
        return getTypeByColor(suit);
    }
}

function getPower(power) {
    return getRank(power);
}

function getSuit(suit) {
    return getColor(suit);
}

export default Card;