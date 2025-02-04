import { writeObject } from "../db/db.js";

async function downloadGameForYear(year) {
    const response = await fetch('https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=' + year + '&gameType=R');
    const json = await response.json();

    // write teams to disk
    writeObject('schedule-' + year, 'master', json);

    // start writing files on disk
    let count = 0;
    const dates = json.dates;
    for (let index = 0; index < dates.length; index++) {
        console.log(`Writing team ${index + 1} of ${dates.length}`);

        const games = dates[index].games;
        for (let gindex = 0; gindex < games.length; gindex++) {
            count++;
            const game = games[gindex];
            writeObject(game.gamePk, 'games-' + year, game);
        }
    }

    return count;
}

async function downloadGames(req, res) {
    console.log('Downloading games...');

    let count = 0;
    count += await downloadGameForYear(2024);
    // count += await downloadGameForYear(2025);

    console.log(`Downloaded data for ${count} games`);
    res.json({
        message: 'Games downloaded',
        total: count
    });
}

export default downloadGames;
