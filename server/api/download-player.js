import { readAllObjects, writeObject } from "../db/db.js";

async function downloadPlayers(req, res) {
    // read all games feed
    const feeds = readAllObjects('games-feed');

    // build a map of all player ids
    const set = new Set();

    for (let index = 0; index < feeds.length; index++) {
        const feed = feeds[index];
        const players = feed.gameData.players;

        const ids = Object.keys(players);
        for (let pindex = 0; pindex < ids.length; pindex++) {
            const id = ids[pindex];
            const player = players[id];
            set.add(player.id);
        }
    }

    console.log(`Found total players: ${set.size}`);

    // iterate over set
    for(const id of set) {
        console.log(`Downloading player ${id}`);
        const response = await fetch('https://statsapi.mlb.com/api/v1/people/' + id);
        const player = await response.json();
        writeObject(id, 'players', player);
    }

    console.log(`Downloaded data for ${count} players`);
    res.json({
        message: 'players downloaded',
        total: set.size
    });

}

export default downloadPlayers;
