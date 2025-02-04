import { readAllObjects } from "../db/db.js";

async function getGames(req, res) {
    let year = req.query.year;
    if (!year) {
        const g24 = readAllObjects('games-2024');
        const g25 = readAllObjects('games-2025');
        const all = g24.concat(g25);
        res.json(all);
        return;
    }

    const games = readAllObjects('games-' + year);
    res.json(games);
}

export default getGames;
