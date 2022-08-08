export default function backCardsToString(tableCards) {
    let tableString = '';
    for (let i = 0; i < tableCards.length; i++) {
        tableString += tableCards[i].getCardByPower(tableCards[i].power) + tableCards[i].getCardBySuit(tableCards[i].suit);
        if (i < tableCards.length - 1) tableString += ',';
    }
    return tableString;
}