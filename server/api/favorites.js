import { readObject, writeObject } from "../db/db.js";

export function readFavorites() {
    const favorites = readObject('favorites', 'user');
    if (!favorites) {
        writeObject('favorites', 'user', {
            teams: {},
            players: {}
        });
    }

    return favorites;
}

export async function getFavorites(req, res) {
    res.json(readFavorites());
}

export async function updateFavorites(req, res) {
    let body = req.body;
    if (typeof body !== 'object') {
        body = JSON.parse(body);
    }

    console.log('update favorites', body);
    const { team, player, add } = body;
    const favorites = readFavorites();

    const { teams = {}, players = {} } = favorites;

    if (add) {
        console.log('adding', team, player);
        if (player) {
            players[player] = true;
        }
        if(team) {
            teams[team] = true;
        }
    } else {
        console.log('removing', team, player);
        if (player) {
            delete players[player];
        }
        if(team) {
            delete teams[team];
        }
    }

    // write updated favorites
    favorites.teams = teams;
    favorites.players = players;

    console.log('written favorites', favorites);

    writeObject('favorites', 'user', favorites);
    res.json(favorites);
}