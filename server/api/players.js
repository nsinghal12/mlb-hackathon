import { readAllObjects, readObject } from "../db/db.js";

export async function getPlayers(req, res) {
    const players = readAllObjects('players');
    res.json(players);
}

export async function getPlayer(req, res) {
    const id = req.params.playerId;
    if (!id) {
        res.status(400).send('Player ID is required');
        return;
    }

    const player = readObject(id, 'players');
    if (!player) {
        res.status(404).send('Player not found');
        return;
    }

    res.json(player);
}
