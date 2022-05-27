const colors = {
    C: 'Clubs',
    D: 'Diamonds',
    H: 'Hearts',
    S: 'Spades'
}

function getColor(color) {
    return colors[color];
}

function getTypeByColor(color) {
    return Object.keys(colors).find(key => colors[key] === color);
}

module.exports = { colors, getColor, getTypeByColor };