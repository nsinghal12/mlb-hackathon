import { readObject } from "../db/db.js";

async function getSchedule(req, res) {
    const teams = await readObject('all-games', 'master');
    res.json(teams);
}

export default getSchedule;
