const Card = require('../../misc/Card');
const Player = require('../../misc/Player');
const hands = require('../../misc/hands');

exports.calculateWinner = (req, res) => {
    try {
        calcWinner(req.query, res);
    } catch (error) {
        res.send(error.message);
    }
}

function calcWinner(req, res) {
    const playersReq = req.pl
    const tableReq = req.t;

    const players = [];
    const playersRanks = [];
    const playersObject = [];

    const playersToStraightFlush = [];
    const playersToFourOfAKind = [];
    const playersToFullHouse = [];
    const playersToFlush = [];
    const playersToStraight = [];
    const playersToThreeOfAKind = [];
    const playersToTwoPair = [];
    const playersToPair = [];


    let winners = [];
    for (let i = 0; i < playersReq.length; i++) {
        if ((players[i] = royalFlush(playersReq[i], tableReq)) != false) {
            playersRanks[i] = 'royalFlush';
            playersObject.push(players[i].player);
        } else if ((players[i] = straightFlush(playersReq[i], tableReq)) != false) {
            playersRanks[i] = 'straightFlush';
            playersObject.push(players[i].player);
            playersToStraightFlush.push(players[i]);
        } else if ((players[i] = fourOfAKind(playersReq[i], tableReq)) != false) {
            playersRanks[i] = 'fourOfAKind';
            playersObject.push(players[i].player);
            playersToFourOfAKind.push(players[i]);
        } else if ((players[i] = fullHouse(playersReq[i], tableReq)) != false) {
            playersRanks[i] = 'fullHouse';
            playersObject.push(players[i].player);
            playersToFullHouse.push(players[i]);
        } else if ((players[i] = flush(playersReq[i], tableReq)) != false) {
            playersRanks[i] = 'flush';
            playersObject.push(players[i].player);
            playersToFlush.push(players[i]);
        } else if ((players[i] = straight(playersReq[i], tableReq)) != false) {
            playersRanks[i] = 'straight';
            playersObject.push(players[i].player);
            playersToStraight.push(players[i]);
        } else if ((players[i] = threeOfAKind(playersReq[i], tableReq)) != false) {
            playersRanks[i] = 'threeOfAKind';
            playersObject.push(players[i].player);
            playersToThreeOfAKind.push(players[i]);
        } else if ((players[i] = twoPair(playersReq[i], tableReq)) != false) {
            playersRanks[i] = 'twoPair';
            playersObject.push(players[i].player);
            playersToTwoPair.push(players[i]);
        } else if ((players[i] = pair(playersReq[i], tableReq)) != false) {
            playersRanks[i] = 'pair';
            playersObject.push(players[i].player);
            playersToPair.push(players[i]);
        } else if ((players[i] = highCard(playersReq[i], tableReq)) != false) {
            playersRanks[i] = 'highCard';
            playersObject.push(players[i].player);
        }
    }
    if (playersToThreeOfAKind.length > 1) {
        winners = determineThreeOfAKindDraw(playersToThreeOfAKind);
    } else if (playersToTwoPair.length > 1) {
        winners = determineTwoPairDraw(playersToTwoPair);
    } else if (playersToPair.length > 1) {
        winners = determinePairDraw(playersToPair);
    } else {
        if ((winners = getHighestPlayersRank(players)) == false) {
            winners = determineHighCardDraw(players);
        }
    }

    res.status(200).send(JSON.stringify({ winners: winners, players: playersObject }));
}

function royalFlush(playerCards, tableCards) {

    return false;
}

function straightFlush(playerCards, tableCards) {

    return false;
}

function fourOfAKind(playerCards, tableCards) {

    return false;
}

function fullHouse(playerCards, tableCards) {

    return false;
}

function flush(playerCards, tableCards) {

    return false;
}

function straight(playerCards, tableCards) {

    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards = cards.playerCards;
    const straightPos = [];
    let hasStraight = false;
    let rejectedPlayerCardsIndexes = [];

    function getUniqueListBy(arr, key) {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }

    tempPlayerTableCards = getUniqueListBy(tempPlayerTableCards, 'power');


    for (let i = 0; i < tempPlayerTableCards.length - 4; i++) {
        if (((tempPlayerTableCards[i].power + 1) == tempPlayerTableCards[i + 1].power) &&
            ((tempPlayerTableCards[i + 1].power + 1) == tempPlayerTableCards[i + 2].power) &&
            ((tempPlayerTableCards[i + 2].power + 1) == tempPlayerTableCards[i + 3].power) &&
            ((tempPlayerTableCards[i + 3].power + 1) == tempPlayerTableCards[i + 4].power)) {
            hasStraight = true;
            straightPos.push(i);
            straightPos.push(i + 1);
            straightPos.push(i + 2);
            straightPos.push(i + 3);
            straightPos.push(i + 4);
        }
    }

    if (straightPos.length > 5) {
        for (let i = 0; i < 5; i++) {
            straightPos.shift();
        }
    } else if (straightPos.length < 5) {
        return false;
    }

    for (let i = 0; i < tempPlayerTableCards.length; i++) {
        if (straightPos.includes(i))
            continue;
        if (rejectedPlayerCardsIndexes.length >= 2) {
            break;
        }
        rejectedPlayerCardsIndexes.push(i);
    }

    tempPlayerTableCards = tempPlayerTableCards.filter(function(value, index) {
        return rejectedPlayerCardsIndexes.indexOf(index) == -1;
    });

    console.log(tempPlayerTableCards);

    // if (tempPlayerTableCards.length > 5) {
    //     const iterationsToShift = tempPlayerTableCards.length - 5;
    //     for (let i = 0; i < iterationsToShift; i++) {
    //         tempPlayerTableCards.shift();
    //     }
    // } else {
    //     return false;
    // }
    // console.log(tempPlayerTableCards);
    return false;
}

function threeOfAKind(playerCards, tableCards) {

    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards = cards.playerCards;
    const threePos = [];
    let hasThreeOfAKind = false;
    let rejectedPlayerCardsIndexes = [];
    let playerPower = 0;

    for (let i = 0; i < tempPlayerTableCards.length - 2; i++) {
        if ((tempPlayerTableCards[i].power == tempPlayerTableCards[i + 1].power) && (tempPlayerTableCards[i + 1].power == tempPlayerTableCards[i + 2].power)) {
            threePos.push(i);
            threePos.push(i + 1);
            threePos.push(i + 2);
        }
    }

    if (threePos.length != 3)
        return false;
    else
        hasThreeOfAKind = true;
    for (let i = 0; i < tempPlayerTableCards.length; i++) {
        if (threePos.includes(i))
            continue;
        if (rejectedPlayerCardsIndexes.length >= 2) {
            break;
        }
        rejectedPlayerCardsIndexes.push(i);
    }

    tempPlayerTableCards = tempPlayerTableCards.filter(function(value, index) {
        return rejectedPlayerCardsIndexes.indexOf(index) == -1;
    });

    tempPlayerTableCards.forEach(x => playerPower += x.power);

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), threeOfAKind.name);

    return hasThreeOfAKind ? { player: player, playerPower: playerPower, playerCards: tempPlayerTableCards, result: threeOfAKind.name } : false;
}

function twoPair(playerCards, tableCards) {

    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards = cards.playerCards;
    const pairPos = [];
    let hasTwoPair = false;
    let rejectedPlayerCardsIndexes = [];
    let playerPower = 0;


    for (let i = 0; i < tempPlayerTableCards.length - 1; i++) {
        if (tempPlayerTableCards[i].power == tempPlayerTableCards[i + 1].power) {
            pairPos.push(i);
            pairPos.push(i + 1);
        }
    }
    if (pairPos.length != 4)
        return false;
    else
        hasTwoPair = true;

    for (let i = 0; i < tempPlayerTableCards.length; i++) {
        if (pairPos.includes(i))
            continue;
        if (rejectedPlayerCardsIndexes.length >= 2) {
            break;
        }
        rejectedPlayerCardsIndexes.push(i);
    }

    tempPlayerTableCards = tempPlayerTableCards.filter(function(value, index) {
        return rejectedPlayerCardsIndexes.indexOf(index) == -1;
    });

    tempPlayerTableCards.forEach(x => playerPower += x.power);

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), twoPair.name);

    return hasTwoPair ? { player: player, playerPower: playerPower, playerCards: tempPlayerTableCards, result: twoPair.name } : false;
}

function pair(playerCards, tableCards) {
    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards = cards.playerCards;
    let hasPair = false;
    const pairPos = [];
    let rejectedPlayerCardsIndexes = [];
    let playerPower = 0;

    for (let i = 0; i < tempPlayerTableCards.length - 1; i++) {
        if (tempPlayerTableCards[i].power == tempPlayerTableCards[i + 1].power) {
            hasPair = true;
            pairPos.push(i)
            pairPos.push(i + 1);
            break;
        }
    }

    for (let i = 0; i < tempPlayerTableCards.length; i++) {
        if (pairPos.includes(i))
            continue;
        if (rejectedPlayerCardsIndexes.length >= 2)
            break;
        rejectedPlayerCardsIndexes.push(i);
    }

    tempPlayerTableCards = tempPlayerTableCards.filter(function(value, index) {
        return rejectedPlayerCardsIndexes.indexOf(index) == -1;
    });

    tempPlayerTableCards.forEach(x => playerPower += x.power);

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), pair.name);

    return hasPair ? { player: player, playerPower: playerPower, playerCards: tempPlayerTableCards, result: pair.name } : false;
}

function highCard(playerCards, tableCards) {
    const cardsCreated = createCards(playerCards, tableCards);
    const tempPlayerTableCards = cardsCreated.playerCards;
    let playerPower = 0;

    tempPlayerTableCards.shift();
    tempPlayerTableCards.shift();
    tempPlayerTableCards.forEach(x => playerPower += x.power);

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), highCard.name);

    return {
        player: player,
        playerPower: playerPower,
        playerCards: tempPlayerTableCards,
        result: highCard.name
    };
}

function determineThreeOfAKindDraw(players) {
    const playersThrees = [];
    const winners = [];

    for (let i = 0; i < players.length; i++) {
        playersThrees[i] = [];
    }

    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players[i].playerCards.length - 2; j++) {
            if ((players[i].playerCards[j].power == players[i].playerCards[j + 1].power) &&
                (players[i].playerCards[j + 1].power == players[i].playerCards[j + 2].power)) {
                playersThrees[i].push(players[i].playerCards[j]);
                playersThrees[i].push(players[i].playerPower);

            }
        }
    }

    let maxPlayerPower = players[0].playerPower;
    let maxThreePower = playersThrees[0].power;
    winners.push(players[0].player);
    for (let i = 1; i < players.length; i++) {
        if (maxThreePower < playersThrees[i].power) {
            if (maxPlayerPower < players[i].playerPower) {
                winners.shift();
                winners.push(players[i].player);
            }
        } else if (maxThreePower == playersThrees[i].power) {
            if (maxPlayerPower < players[i].playerPower) {
                winners.shift();
                winners.push(players[i].playerPower);
            } else if (maxPlayerPower == players[i].playerPower) {
                winners.push(players[i].player);
            }
        }
    }
    console.log(winners);
    return winners;
}

function determineTwoPairDraw(players) {
    const playersPairs = [];
    const winners = [];

    for (let i = 0; i < players.length; i++) {
        playersPairs[i] = [];
    }

    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players[i].playerCards.length - 1; j++) {
            if (players[i].playerCards[j].power == players[i].playerCards[j + 1].power) {
                playersPairs[i].push(players[i].playerCards[j]);
                playersPairs[i].push(players[i].playerPower);
            }
        }
    }

    let maxPlayerPower = players[0].playerPower;
    let maxPairPower = playersPairs[0].power;
    winners.push(players[0].player);
    for (let i = 1; i < playersPairs.length; i++) {
        if (maxPairPower < playersPairs[i].power) {
            if (maxPlayerPower < players[i].playerPower) {
                winners.shift();
                winners.push(players[i].player);
            }
        } else if (maxPairPower == playersPairs[i].power) {
            if (maxPlayerPower < players[i].playerPower) {
                winners.shift();
                winners.push(players[i].player);
            } else if (maxPlayerPower == players[i].playerPower) {
                winners.push(players[i].player);
            }
        }
    }
    return winners;
}

function determinePairDraw(players) {

    const playersPairs = [];
    const winners = [];

    for (let i = 0; i < players.length; i++) {
        playersPairs[i] = [];
    }

    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players[i].playerCards.length - 1; j++) {
            if (players[i].playerCards[j].power == players[i].playerCards[j + 1].power) {
                playersPairs[i].push(players[i].playerCards[j]);
                playersPairs[i].push(players[i].playerPower);
                break;
            }
        }
    }

    let maxPlayerPower = players[0].playerPower;
    let maxPairPower = playersPairs[0].power;
    winners.push(players[0].player);
    for (let i = 1; i < playersPairs.length; i++) {
        if (maxPairPower < playersPairs[i].power) {
            if (maxPlayerPower < players[i].playerPower) {
                winners.shift();
                winners.push(players[i].player);
            }
        } else if (maxPairPower == playersPairs[i].power) {
            if (maxPlayerPower < players[i].playerPower) {
                winners.shift();
                winners.push(players[i].player);
            } else if (maxPlayerPower == players[i].playerPower) {
                winners.push(players[i].player);
            }
        }
    }

    return winners;
}

function determineHighCardDraw(players) {
    const indexes = [];
    const winners = [];
    let max = players[0].playerPower;
    for (let i = 1; i < players.length; i++) {
        if (max < players[i].playerPower) {
            max = players[i].playerPower;
        }
    }

    for (let i = 0; i < players.length; i++) {
        if (players[i].playerPower == max) {
            indexes.push[i];
            winners.push(players[i].player);
        }
    }

    return winners;
}

// function playersToDetermineTwoPair(playersRanks, players) {
//     const playersToTwoPairsTemp = [];
//     for (let i = 0; i < playersRanks.length; i++) {
//         for (let j = 0; j < playersRanks.length; j++) {
//             if (i == j || j == i) continue;
//             if (playersRanks[i] == playersRanks[j] && playersRanks[i] == 'twoPair') {
//                 playersToTwoPairsTemp.push(players[i]);
//                 playersToTwoPairsTemp.push(players[j]);
//             }
//         }
//     }
//     return [...new Set([...playersToTwoPairsTemp])];
// }

// function playersToDeterminePair(playersRanks, players) {
//     const playersToPairsTemp = [];
//     for (let i = 0; i < playersRanks.length; i++) {
//         for (let j = 0; j < playersRanks.length; j++) {
//             if (i == j || j == i) continue;
//             if (playersRanks[i] == playersRanks[j] && playersRanks[i] == 'pair') {
//                 playersToPairsTemp.push(players[i]);
//                 playersToPairsTemp.push(players[j]);
//             }
//         }
//     }
//     return [...new Set([...playersToPairsTemp])];
// }

function getHighestPlayersRank(players) {
    const playersRanks = [];
    for (let i = 0; i < players.length; i++) {
        playersRanks[i] = hands[players[i].result];
    }
    const max = Math.max(...playersRanks);
    const index = playersRanks.indexOf(max);
    return players[index].player;
}

function createCards(playerCards, tableCards) {
    const tableCardsSplit = tableCards.split(',');
    const tempTableCards = []
    const tempPlayerCards = [];
    let tempPlayerTableCards = [];
    const tempPlayerCardsSplitted = playerCards.split(',');

    for (let i = 0; i < tableCardsSplit.length; i++) {
        tempTableCards.push(new Card(tableCardsSplit[i].toUpperCase().charAt(0), tableCardsSplit[i].toUpperCase().charAt(1)));
    }

    tempPlayerCards.push(new Card(tempPlayerCardsSplitted[0].toUpperCase().charAt(0), tempPlayerCardsSplitted[0].toUpperCase().charAt(1)));
    tempPlayerCards.push(new Card(tempPlayerCardsSplitted[1].toUpperCase().charAt(0), tempPlayerCardsSplitted[1].toUpperCase().charAt(1)));

    tempPlayerTableCards = tempPlayerCards.concat(tempTableCards);

    tempPlayerTableCards.sort((a, b) => {
        if (a.power > b.power) return 1;
        if (a.power < b.power) return -1;
        return 0;
    });

    return { playerCards: tempPlayerTableCards };
}

function backCardsToString(tableCards) {
    let tableString = '';
    for (let i = 0; i < tableCards.length; i++) {
        tableString += tableCards[i].getCardByPower(tableCards[i].power) + tableCards[i].getCardBySuit(tableCards[i].suit);
        if (i < tableCards.length - 1) tableString += ',';
    }
    return tableString;
}