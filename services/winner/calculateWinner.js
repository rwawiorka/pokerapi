const Card = require('../../misc/Card');
const Player = require('../../misc/Player');
const hands = require('../../misc/hands');

function calcWinner(req, res) {
    const playersReq = req.pl
    const tableReq = req.t;

    const players = [];
    const playersRanks = [];
    const playersObject = [];

    const playersToRoyalFlush = [];
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
            playersToRoyalFlush.push(players[i]);
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
    if (playersToRoyalFlush.length > 0) {
        winners = playersToRoyalFlush[0].player;
    } else if (playersToStraightFlush.length > 1) {
        winners = determineStraightFlushDraw(playersToStraightFlush);
    } else if (playersToFourOfAKind.length > 1) {
        winners = determineFourOfAKindDraw(playersToFourOfAKind);
    } else if (playersToFullHouse.length > 1) {
        winners = determineFullHouseDraw(playersToFullHouse);
    } else if (playersToFlush.length > 1) {
        winners = determineFlushDraw(playersToFlush);
    } else if (playersToStraight.length > 1) {
        winners = determineStraightDraw(playersToStraight);
    } else if (playersToThreeOfAKind.length > 1) {
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

let royalFlush = function(playerCards = false, tableCards) {
    let playerStraightFlush;
    let hasRoyalFlush = false;

    if ((playerStraightFlush = straightFlush(playerCards, tableCards)) != false) {
        if ((playerStraightFlush.playerCards[4].power == 14) &&
            (playerStraightFlush.playerCards[0].power == 10)) {
            hasRoyalFlush = true;
        }
    }
    if (hasRoyalFlush == false) {
        return false;
    }

    playerStraightFlush.player.result = 'royalFlush';

    return hasRoyalFlush ? { player: playerStraightFlush.player, playerPower: playerStraightFlush.playerPower, playerCards: playerStraightFlush.playerCards, result: royalFlush.name } : false;
}

let straightFlush = function(playerCards = false, tableCards) {

    const cards = createCards(playerCards, tableCards);
    let hasStraightFlush = false;
    let playerStraight;
    let playerFlush;

    if ((playerStraight = straight(playerCards, tableCards))) {
        if ((playerFlush = flush(playerStraight.player.cards, tableCards))) {
            hasStraightFlush = true;
        }
    }

    if (hasStraightFlush == false) { return false; }

    playerFlush.player.result = 'straightFlush';
    return hasStraightFlush ? { player: playerFlush.player, playerPower: playerFlush.playerPower, playerCards: playerFlush.playerCards, result: straightFlush.name } : false;
}

let fourOfAKind = function(playerCards = false, tableCards) {
    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards;
    if (playerCards) {
        tempPlayerTableCards = cards.playerCards;
    } else {
        tempPlayerTableCards = cards.tableCards;
    }
    let hasFourOfAKind = false;
    const fourPos = [];
    let rejectedPlayerCardsIndexes = [];
    let playerPower = 0;

    for (let i = 0; i < tempPlayerTableCards.length - 3; i++) {
        if ((tempPlayerTableCards[i].power == tempPlayerTableCards[i + 1].power) &&
            (tempPlayerTableCards[i + 1].power == tempPlayerTableCards[i + 2].power) &&
            (tempPlayerTableCards[i + 2].power == tempPlayerTableCards[i + 3].power)) {
            hasFourOfAKind = true;
            fourPos.push(i);
            fourPos.push(i + 1);
            fourPos.push(i + 2);
            fourPos.push(i + 3);
        }
    }

    if (hasFourOfAKind == false) { return false; }

    if (fourPos.length > 4) {
        const fourPosLength = fourPos.length;
        for (let i = 0; i < fourPosLength - 4; i++) {
            fourPos.shift();
        }
    }

    for (let i = 0; i < tempPlayerTableCards.length; i++) {
        if (fourPos.includes(i)) {
            continue;
        }
        if (rejectedPlayerCardsIndexes.length >= 2) {
            break;
        }
        rejectedPlayerCardsIndexes.push(i);
    }

    tempPlayerTableCards = tempPlayerTableCards.filter(function(value, index) {
        return rejectedPlayerCardsIndexes.indexOf(index) == -1;
    });

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), fourOfAKind.name);

    return hasFourOfAKind ? { player: player, playerPower: playerPower, playerCards: tempPlayerTableCards, result: fourOfAKind.name } : false;
}

let fullHouse = function(playerCards = false, tableCards) {
    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards;
    if (playerCards) {
        tempPlayerTableCards = cards.playerCards;
    } else {
        tempPlayerTableCards = cards.tableCards;
    }
    let hasFullHouse = false;
    const threePos = [];
    const pairPos = [];
    let threesCardPower;
    let rejectedPlayerCardsIndexes = [];
    let playerPower = 0;

    for (let i = 0; i < tempPlayerTableCards.length - 2; i++) {
        if ((tempPlayerTableCards[i].power == tempPlayerTableCards[i + 1].power) && (tempPlayerTableCards[i + 1].power == tempPlayerTableCards[i + 2].power)) {
            threePos.push(i);
            threePos.push(i + 1);
            threePos.push(i + 2);
            threesCardPower = tempPlayerTableCards[i].power;
            for (let j = 0; j < tempPlayerTableCards.length - 1; j++) {
                if ((tempPlayerTableCards[j].power == tempPlayerTableCards[j + 1].power) && (tempPlayerTableCards[j].power != threesCardPower)) {
                    pairPos.push(j);
                    pairPos.push(j + 1);
                    hasFullHouse = true;
                }
            }
        }
    }

    if (hasFullHouse == false) { return false; }

    if (threePos.length > 3) {
        const threePosLength = threePos.length;
        for (let i = 0; i < threePosLength - 3; i++) {
            threePos.shift();
        }
    }

    if (pairPos.length > 2) {
        const pairPosLength = pairPos.length;
        for (let i = 0; i < pairPosLength - 2; i++) {
            pairPos.shift();
        }
    }

    for (let i = 0; i < tempPlayerTableCards.length; i++) {
        if (threePos.includes(i) || pairPos.includes(i)) {
            continue;
        }
        if (rejectedPlayerCardsIndexes.length >= 2) {
            break;
        }
        rejectedPlayerCardsIndexes.push(i);
    }
    tempPlayerTableCards = tempPlayerTableCards.filter(function(value, index) {
        return rejectedPlayerCardsIndexes.indexOf(index) == -1;
    });

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), fullHouse.name);

    return hasFullHouse ? { player: player, playerPower: playerPower, playerCards: tempPlayerTableCards, result: fullHouse.name } : false;
}

let flush = function(playerCards = false, tableCards) {
    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards;
    if (playerCards) {
        tempPlayerTableCards = cards.playerCards;
    } else {
        tempPlayerTableCards = cards.tableCards;
    }
    let hasFlush = false;
    const diamondsPos = [];
    const spadesPos = [];
    const heartsPos = [];
    const clubsPos = [];
    let rejectedPlayerCardsIndexes = [];
    let playerPower = 0;
    let flushColor;

    for (let i = 0; i < tempPlayerTableCards.length; i++) {
        const card = tempPlayerTableCards[i];
        switch (card.suit) {
            case 'Diamonds':
                diamondsPos.push(i);
                break;
            case 'Spades':
                spadesPos.push(i);
                break;
            case 'Hearts':
                heartsPos.push(i);
                break;
            case 'Clubs':
                clubsPos.push(i);
                break;
        }
    }

    if (diamondsPos.length >= 5) {
        hasFlush = true;
        flushColor = 'diamonds';
    } else if (spadesPos.length >= 5) {
        hasFlush = true;
        flushColor = 'spades';
    } else if (heartsPos.length >= 5) {
        hasFlush = true;
        flushColor = 'hearts';
    } else if (clubsPos.length >= 5) {
        hasFlush = true;
        flushColor = 'clubs';
    } else {
        return hasFlush = false;
    }

    function rejectUnnecessaryCards(pos) {
        for (let i = 0; i < tempPlayerTableCards.length; i++) {
            if (pos.includes(i)) {
                continue;
            }
            if (rejectedPlayerCardsIndexes.length >= 2) {
                break;
            }
            rejectedPlayerCardsIndexes.push(i);
        }
    }

    switch (flushColor) {
        case 'diamonds':
            rejectUnnecessaryCards(diamondsPos);
            break;
        case 'spades':
            rejectUnnecessaryCards(spadesPos);
            break;
        case 'hearts':
            rejectUnnecessaryCards(heartsPos);
            break;
        case 'clubs':
            rejectUnnecessaryCards(clubsPos);
            break;
    }

    tempPlayerTableCards = tempPlayerTableCards.filter(function(value, index) {
        return rejectedPlayerCardsIndexes.indexOf(index) == -1;
    });

    if (tempPlayerTableCards.length > 5) {
        const tempPlayerTableCardsLength = tempPlayerTableCards.length;
        for (let i = 0; i < tempPlayerTableCardsLength - 5; i++) {
            tempPlayerTableCards.shift();
        }
    }

    tempPlayerTableCards.forEach(x => playerPower += x.power);

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), flush.name);

    return hasFlush ? { player: player, playerPower: playerPower, playerCards: tempPlayerTableCards, result: flush.name } : false;
}

let straight = function(playerCards = false, tableCards) {

    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards;
    if (playerCards) {
        tempPlayerTableCards = cards.playerCards;
    } else {
        tempPlayerTableCards = cards.tableCards;
    }
    const straightPos = [];
    let hasStraight = false;
    let rejectedPlayerCardsIndexes = [];
    let playerPower = 0;

    tempPlayerTableCards = getUniqueListBy(tempPlayerTableCards, 'power');

    if (tempPlayerTableCards.length < 5) { return false; }

    if (tempPlayerTableCards[0].power == 2 &&
        tempPlayerTableCards[1].power == 3 &&
        tempPlayerTableCards[2].power == 4 &&
        tempPlayerTableCards[3].power == 5 &&
        tempPlayerTableCards[tempPlayerTableCards.length - 1].power == 14) {
        hasStraight = true;
        straightPos.push(0);
        straightPos.push(1);
        straightPos.push(2);
        straightPos.push(3);
        straightPos.push(tempPlayerTableCards.length - 1);
        tempPlayerTableCards[tempPlayerTableCards.length - 1].power = 1;
    } else {
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
    }

    if (straightPos.length > 5) {
        for (let i = 0; i < 5; i++) {
            straightPos.shift();
        }
        hasStraight = true;
    } else if (straightPos.length < 5) {
        return false;
    } else {
        hasStraight = true;
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

    tempPlayerTableCards.forEach(x => playerPower += x.power);

    const player = new Player(playerCards, backCardsToString(tempPlayerTableCards), straight.name);

    return hasStraight ? { player: player, playerPower: playerPower, playerCards: tempPlayerTableCards, result: straight.name } : false;

}

let threeOfAKind = function(playerCards = false, tableCards) {
    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards;
    if (playerCards) {
        tempPlayerTableCards = cards.playerCards;
    } else {
        tempPlayerTableCards = cards.tableCards;
    }
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
    if (threePos.length > 3) {
        threePos.shift();
        threePos.shift();
        threePos.shift();
        hasThreeOfAKind = true;
    } else if (threePos.length < 3) {
        return false;
    } else {
        hasThreeOfAKind = true;
    }

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

let twoPair = function(playerCards = false, tableCards) {

    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards;
    if (playerCards) {
        tempPlayerTableCards = cards.playerCards;
    } else {
        tempPlayerTableCards = cards.tableCards;
    }
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

let pair = function(playerCards = false, tableCards) {
    const cards = createCards(playerCards, tableCards);
    let tempPlayerTableCards;
    if (playerCards) {
        tempPlayerTableCards = cards.playerCards;
    } else {
        tempPlayerTableCards = cards.tableCards;
    }
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

let highCard = function(playerCards = false, tableCards) {
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

function determineStraightFlushDraw(players) {
    return determineStraightDraw(players);
}

function determineFourOfAKindDraw(players) {
    const mostRepeatedPlayersCardsPower = [];
    const mostRepeatedPlayersCards = [];
    const winners = [];
    let maxRepeatedPower = 0;

    for (let i = 0; i < players.length; i++) {
        mostRepeatedPlayersCardsPower[i] = [];
        for (let j = 0; j < players[i].playerCards.length; j++) {
            mostRepeatedPlayersCardsPower[i].push(players[i].playerCards[j].power);
        }
    }
    for (let i = 0; i < players.length; i++) {
        mostRepeatedPlayersCards.push(mode(mostRepeatedPlayersCardsPower[i], 'most'));
    }

    maxRepeatedPower = Math.max(...mostRepeatedPlayersCards);
    let indexes = [],
        i = -1;
    while ((i = mostRepeatedPlayersCards.indexOf(maxRepeatedPower, i + 1)) != -1) {
        indexes.push(i);
    }
    if (indexes.length == 1) {
        winners.push(players[indexes[0]].player);
    } else {
        for (let i = 0; i < players.length; i++) {
            winners.push(players[i].player);
        }
    }

    return winners;
}

function determineFullHouseDraw(players) {
    const mostRepeatedPlayersCards = [];
    const leastRepeatedPlayersCards = [];
    const winners = [];

    for (let i = 0; i < players.length; i++) {
        mostRepeatedPlayersCards.push(mode(players[i].playerCards, 'most').power);
        leastRepeatedPlayersCards.push(mode(players[i].playerCards, 'least').power);
    }

    const maxMostRepeatedPower = Math.max(...mostRepeatedPlayersCards);
    const maxLeastRepeatedPower = Math.max(...leastRepeatedPlayersCards);

    let indexes = [],
        i = -1;
    while ((i = mostRepeatedPlayersCards.indexOf(maxMostRepeatedPower, i + 1)) != -1) {
        indexes.push(i);
    }

    if (indexes.length == 1) {
        winners.push(players[indexes[0]].player);
    } else {
        let indexes = [],
            i = -1;
        while ((i = leastRepeatedPlayersCards.indexOf(maxLeastRepeatedPower, i + 1)) != -1) {
            indexes.push(i);
        }
        if (indexes.length == 1) {
            winners.push(players[indexes[0]].player);
        } else {
            for (let i = 0; i < players.length; i++) {
                winners.push(players[i].player);
            }
        }
    }

    return winners;
}

function determineFlushDraw(players) {
    const playersPower = [];
    const winners = [];
    let maxPower = players[0].playerPower;

    for (let i = 0; i < players.length; i++) {
        playersPower.push(players[i].playerPower);
        if (players[i].playerPower > maxPower) {
            maxPower = players[i].playerPower;
        }
    }
    let indexes = [],
        i = -1;
    while ((i = playersPower.indexOf(maxPower, i + 1)) != -1) {
        indexes.push(i);
    }

    if (indexes.length == 1) {
        winners.push(players[indexes[0]].player);
    } else {
        for (let i = 0; i < players.length; i++) {
            winners.push(players[indexes[i]].player);
        }
    }

    return winners;
}

function determineStraightDraw(players) {
    const playersPower = [];
    const winners = [];
    let maxPower = players[0].playerPower;

    for (let i = 0; i < players.length; i++) {
        playersPower.push(players[i].playerPower);
        if (players[i].playerPower > maxPower) {
            maxPower = players[i].playerPower;
        }
    }

    let indexes = [],
        i = -1;
    while ((i = playersPower.indexOf(maxPower, i + 1)) != -1) {
        indexes.push(i);
    }

    if (indexes.length == 1) {
        winners.push(players[indexes[0]].player);
    } else {
        for (let i = 0; i < indexes.length; i++) {
            winners.push(players[indexes[i]].player);
        }
    }

    return winners;
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
                winners.push(players[i].player);
            } else if (maxPlayerPower == players[i].playerPower) {
                winners.push(players[i].player);
            }
        }
    }

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
    return { playerCards: tempPlayerTableCards, tableCards: tempTableCards };
}

function backCardsToString(tableCards) {
    let tableString = '';
    for (let i = 0; i < tableCards.length; i++) {
        tableString += tableCards[i].getCardByPower(tableCards[i].power) + tableCards[i].getCardBySuit(tableCards[i].suit);
        if (i < tableCards.length - 1) tableString += ',';
    }
    return tableString;
}

function mode(arr, calc) {
    if (calc == 'most') {
        return arr.sort((a, b) =>
            arr.filter(v => v === a).length - arr.filter(v => v === b).length
        ).pop();
    } else if (calc == 'least') {
        return arr.sort((a, b) =>
            arr.filter(v => v === a).length - arr.filter(v => v === b).length
        ).shift();
    } else {
        return arr.sort((a, b) =>
            arr.filter(v => v === a).length - arr.filter(v => v === b).length
        );
    }
}

function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

module.exports = {
    calculateWinner: function(req, res) {
        try {
            calcWinner(req.query, res);
        } catch (error) {
            res.send(error.message, error.stack);
        }
    },
    royalFlush,
    straightFlush,
    fourOfAKind,
    fullHouse,
    flush,
    straight,
    threeOfAKind,
    twoPair,
    pair,
    highCard,
}