import { readObject } from "../db/db.js";

export async function getTeams(req, res) {
    const teams = readObject('all-teams', 'master');
    res.json(teams.teams);
}

export async function getTeam(req, res) {
    const id = req.params.teamId;
    if (!id) {
        res.status(400).send('Team ID is required');
        return;
    }

    const team = readObject(id, 'teams');
    if (!team) {
        res.status(404).send('Team not found');
        return;
    }

    res.json(team);
}
