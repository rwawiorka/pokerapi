class Player {
    constructor(cards, hand, result) {
        this.cards = cards.toUpperCase();
        this.hand = hand;
        this.result = result;
    }

}

module.exports = Player;