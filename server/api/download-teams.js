import { writeObject } from "../db/db.js";

async function downloadTeams(req, res) {
    console.log('Downloading teams...');
    const response = await fetch('https://statsapi.mlb.com/api/v1/teams');
    const json = await response.json();

    // write teams to disk
    await writeObject('all-teams', 'master', json);

    // start writing files on disk
    const teams = json.teams;
    for(let index = 0; index  < teams.length; index++) {
        const team = teams[index];
        await writeObject(team.id, 'teams', team);
    }

    console.log(`Downloaded data for ${teams.length} teams`);
    res.json({
        message: 'Teams downloaded',
        total: teams.length
    });
}

export default downloadTeams;
