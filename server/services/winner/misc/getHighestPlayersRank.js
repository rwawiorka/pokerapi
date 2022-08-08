import hands from '../../../misc/hands';

export default function getHighestPlayersRank(players) {
    const playersRanks = [];
    for (let i = 0; i < players.length; i++) {
        playersRanks[i] = hands[players[i].result];
    }
    const max = Math.max(...playersRanks);
    const index = playersRanks.indexOf(max);
    return players[index].player;
}