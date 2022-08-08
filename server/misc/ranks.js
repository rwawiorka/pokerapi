const ranks = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14
}

function getRank(rank) {
    return ranks[rank];
}

function getTypeByRank(rank) {
    return Object.keys(ranks).find(key => ranks[key] === rank);
}

export { ranks, getRank, getTypeByRank };