const BASE_URI = 'http://localhost:3000';

function getUrl(path: string): string {
    return `${BASE_URI}${path}`;
}

export async function downloadTeams() {
    const response = await fetch(getUrl('/download/teams'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}

export async function downloadGames() {
    const response = await fetch(getUrl('/download/games'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}

export async function getTeam(teamId: string) {
    const response = await fetch(getUrl(`/teams/${teamId}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}

export async function getPlayer(playerId: string) {
    const response = await fetch(getUrl(`/players/${playerId}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json?.people?.[0];
}

export async function getTeamData() {
    const response = await fetch(getUrl('/teams'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}

export async function getGames() {
    const response = await fetch(getUrl('/games'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}

export async function downloadGamesContent() {
    const response = await fetch(getUrl('/download/games/content'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}

export async function downloadGamesFeed() {
    const response = await fetch(getUrl('/download/games/feed'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}

export async function downloadPlayerData() {
    const response = await fetch(getUrl('/download/players'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}

export async function getPlayers() {
    const response = await fetch(getUrl('/players'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}

export async function getFavorites() {
    const response = await fetch(getUrl('/favorites'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}

export async function toggleFavoritePlayer(add: boolean, playerId: string) {
    const response = await fetch(getUrl('/favorites'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            player: playerId,
            add: add,
        }),
    });
    const json = await response.json();
    return json;
}

export async function toggleFavoriteTeam(add: boolean, teamId: string) {
    const response = await fetch(getUrl('/favorites'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            team: teamId,
            add: add,
        }),
    });
    const json = await response.json();
    return json;
}

export async function runTeamAnalysis() {
    const response = await fetch(getUrl('/analysis/teams'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}

export async function extractGameInfo() {
    const response = await fetch(getUrl('/analysis/games'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}

export async function getDigestList() {
    const response = await fetch(getUrl('/digests'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}

export async function createDigest(date: string, duration: string) {
    const response = await fetch(getUrl('/digests'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            date: date,
            duration: duration,
        }),
    });
    const json = await response.json();
    return json;
}

export async function getDigest(digestId: string) {
    const response = await fetch(getUrl(`/digests/${digestId}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const json = await response.json();
    return json;
}
