class Player {
    constructor(cards, hand, result) {
        if (cards) {
            this.cards = cards.toUpperCase();
        }
        this.hand = hand;
        this.result = result;
    }

}

module.exports = Player;