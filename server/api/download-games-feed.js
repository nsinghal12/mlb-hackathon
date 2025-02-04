import { readAllObjects, writeObject } from "../db/db.js";

async function downloadGamesFeed(req, res) {
    const g24 = readAllObjects('games-2024');
    const g25 = readAllObjects('games-2025');
    const all = g24.concat(g25);
    
    for(let index = 0; index < all.length; index++) {
        const game = all[index];
        console.log('Writing game feed ' + game.gamePk);
        const contentLink = game.link
        const content = await fetch('https://statsapi.mlb.com' + contentLink);
        const json = await content.json();
        writeObject(game.gamePk, 'games-feed', json);
    }

    res.json({
        message: 'Games feed downloaded',
        total: all.length
    });
}

export default downloadGamesFeed;

