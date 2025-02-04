import { readAllObjects, readObject, writeObject } from "../db/db.js";
import { executeLlmPrompt } from "../llm/llm.js";
import { readFavorites } from "./favorites.js";

function getDurationInDays(duration) {
    switch (duration.toLowerCase()) {
        case 'week':
            return 7;
        case 'month':
            return 30;
        case 'year':
            return 365;
        default:
            return 7;
    }
}

function asNumber(x) {
    try {
        return parseInt(x);
    } catch (e) {
        return -1;
    }
}

function getMatchTitle(teamId, match) {
    const isHome = match.homeTeam.id === teamId;
    const team = isHome ? match.homeTeam : match.awayTeam;
    const opponent = isHome ? match.awayTeam : match.homeTeam;

    return `${team.name} vs ${opponent.name}`;
}

function getMatchScore(teamId, match) {
    const isWinner = match.winner === teamId;

    if (isWinner) {
        return `${match.score.win}/${match.score.loss}`;
    }

    return `${match.score.loss}/${match.score.win}`;
}

export async function getParticularDigest(req, res) {
    const { digestId } = req.params;
    const digest = readObject(digestId, 'digests');
    if (!digest) {
        return res.status(404).json({ error: 'Digest not found' });
    }

    res.json(digest);
}

export async function getDigests(req, res) {
    const digests = readAllObjects('digests') || [];
    res.json(digests);
}

export async function createDigest(req, res) {
    const { date, duration } = req.body;

    const favorites = readFavorites();

    console.log('creating digest for: ', favorites, date, duration);

    const matches = readObject('team-matches', 'analysis');
    const summaries = readObject('game-summaries', 'analysis');

    if (favorites.teams.length === 0 && favorites.players.length === 0) {
        console.log('creating digest, nothing to do.');
        return res.status(400).json({ error: 'No favorites found' });
    }

    // for the given date and duration
    // find all previous games between the given date and (given date - duration)

    // create team digest
    console.log('creating digest, starting...');
    const details = [];
    const teamKeys = Object.keys(favorites.teams);
    for (let index = 0; index < teamKeys.length; index++) {
        const teamId = teamKeys[index];

        const team = readObject(teamId, 'teams');

        const teamMatches = matches[teamId];
        const teamDigest = await getTeamDigest(teamId, date, duration, teamMatches, summaries);
        if (teamDigest) {
            details.push({
                teamId,
                name: team.name,
                teamDigest
            });
        }
    }

    // create player digest
    const playerKeys = Object.keys(favorites.players);
    for (let index = 0; index < playerKeys.length; index++) {
        const playerId = playerKeys[index];

        const playerDigest = await getPlayerDigest(playerId, date, duration);
        if (playerDigest) {
            details.push({
                playerId,
                playerDigest
            });
        }
    }

    // flatten the array
    const flatDetails = details.flat();
    const now = new Date();
    const digestName = 'digest-' + now.getTime();

    const digest = {
        id: digestName,
        created: now.toISOString(),
        date,
        duration,
        favorites,
        details: flatDetails
    };

    console.log('done creating digest: ' + digestName)
    writeObject(digestName, 'digests', digest);
    res.json({
        message: 'Digest created successfully',
        id: digestName
    });
}

async function getTeamDigest(teamId, date, duration, teamMatches, summaries) {
    console.log('creating team digest for: ', teamId);

    if(!teamMatches || teamMatches.length === 0) {
        console.log('  - no matches found for team');
        return null;
    }

    const team = readObject(teamId, 'teams');

    // filter matches in duration
    const todayDate = new Date(date);
    const todayTime = todayDate.getTime();
    const timeInPast = todayTime - (getDurationInDays(duration) * 24 * 3600 * 1000);

    const oldMatches = [];

    console.log('filtering between: ', timeInPast, todayTime);

    // start finding
    const matchesInDuration = teamMatches.filter(match => {
        const d = match.date;
        const dYear = d.substring(0, 4);
        const dMonth = d.substring(5, 7);
        const dDate = d.substring(8);

        const dateOfGameInMillis = new Date(dYear, dMonth - 1, dDate).getTime();

        if (dateOfGameInMillis < timeInPast) {
            oldMatches.push(match);
        }

        if (dateOfGameInMillis >= timeInPast && dateOfGameInMillis <= todayTime) {
            return true;
        }

        return false;
    });

    console.log('matches before the duration: ', oldMatches.length);
    console.log('total matches in duration: ', matchesInDuration.length);

    // get a single summary for older matches for the team
    const oldMatchTrack = await getLlmSummaryForAllOldMatches(teamId, team, oldMatches, summaries);

    // for each match in duration, get the summary
    const llm = [];
    for (let index = 0; index < matchesInDuration.length; index++) {
        const match = matchesInDuration[index];
        const summary = summaries[match.gameId];

        if (summary) {
            const llmSummary = await getLLMSummaryFromMatchSummary(match, summary);
            llm.push({
                match,
                name: getMatchTitle(teamId, match),
                score: getMatchScore(teamId, match),
                date: match.date,
                title: summary.title,
                imageUrl: summary.imageUrl,
                imageText: summary.imageTitle,
                videoUrl: summary.videoUrl,
                llmSummary
            });
        }
    }

    return {
        recap: oldMatchTrack,
        currentGames: llm
    };
}

async function getLlmSummaryForAllOldMatches(teamId, team, oldMatches, summaries) {
    const image = await getLlmSummaryForAllOldMatchesImage(teamId, team, oldMatches, summaries);
    const para = await getLlmSummaryForAllOldMatchesPara(teamId, team, oldMatches, summaries);

    return {
        image,
        para
    };
}

async function getLlmSummaryForAllOldMatchesImage(teamId, team, oldMatches, summaries) {
    let prompt = `
    I am preparing a digest for a MLB team fan. The team has played the
    following matches before the selected period of digest. 

    Below is a list of all the images captured during these matches 
    with a text line that best describes the image. I am sending them via
    indexed list. Return the index number of the image that best describes
    the journey of the team so far in the season as a single image.

    Note the user is interested in '${team.name}' team only.
    `;

    for (let index = 0; index < oldMatches.length; index++) {
        const match = oldMatches[index];
        const summary = summaries[match.gameId];

        prompt += `
            ${index + 1}: "${summary.imageTitle}" \n\n
        `;
    }

    prompt += `
    \n\n----\n\n

    Return only the index number of the image from given prompt. 
    Do not add any extra information.
    Do not add any extra text.
    Do not use any information from outside what is given in prompt.
    Remember return only the number prefix to the title line
    `;

    console.log('prompt for current season images: ', prompt);
    const llm = await executeLlmPrompt(prompt);
    console.log('\n\nprevious image llm: ', llm);

    const num = asNumber(llm);
    if (num >= 0) {
        const match = oldMatches[num];
        const summary = summaries[match.gameId];

        return {
            image: summary.imageUrl,
            title: summary.imageTitle
        }
    }

    return {
        text: llm
    }
}

async function getLlmSummaryForAllOldMatchesPara(teamId, team, oldMatches, summaries) {
    let prompt = `
    I am preparing a digest for a MLB team fan. The team has played the
    following matches before the selected period of digest. I want you to
    create me a summary of all the matches in a single paragraph, that describes
    the journey of team so far in the season. Make it crisp for a digest.

    Note the user is interested in '${team.name}' in this summary. Write it
    from this team's perspective.
    
    Return the paragraph to read. Do not use headings or bullet points.
    Do not add any extra information. Do not add any extra text.

    The summaries of the matches are as follows (in markdown format) where
    the heading describes the teams playing the match, the score. It is followed
    by a line that starts with 'image title: ' prefix, it describes the main image
    of this match. Lastly, it is followed by the paragraph below the summary. 
    
    Replace any day to the date of the match as these happened in the past.
    `;

    for (let index = 0; index < oldMatches.length; index++) {
        const match = oldMatches[index];
        const summary = summaries[match.gameId];
        const winTeam = match.winner === match.homeTeam.id ? match.homeTeam : match.awayTeam;

        prompt += `
            # ${match.homeTeam.name} (home team) vs ${match.awayTeam.name} (away team) won by ${winTeam.name} with a score of ${match.score.win}/${match.score.loss} played on ${match.date}

            image title: ${summary.imageTitle}

            ${summary.body}
        `;
    }

    // console.log('prompt for current season track record: ', prompt);
    const llm = await executeLlmPrompt(prompt);
    console.log('\n\n\nprevious match llm: ', llm);

    return llm;
}

async function getPlayerDigest(playerId, date, duration) {

}

async function getLLMSummaryFromMatchSummary(match, summary) {
    const { score } = match;
    const { gameId, title, body } = summary;

    console.log('getting llm summary for: ', gameId);

    const llmSummary = readObject(gameId, 'llm-summaries');
    if (llmSummary) {
        console.log('  - found llm summary in cache');
        return llmSummary;
    }

    const winTeam = match.winner === match.homeTeam.id ? match.homeTeam : match.awayTeam;

    // call the LLM API
    const prompt = `
    Extract all key points with interesting statistics from the
    following game summary between the '${match.homeTeam.name}' 
    (the home team) and the '${match.awayTeam.name}' (the away team).

    The match was won by '${winTeam.name}' with the final score of
    ${score.win}/${score.loss}.
    
    Ensure to include notable player performances, team stats, and 
    any other significant details mentioned in the summary. Avoid 
    rephrasing the full summary; only highlight the key points. Use 
    complete team names and player name, do not abbreviate. 
    
    Use markdown bullets for results. Use plain simple text. 
    Do not add a heading, or group.
    
    The game summary follows below: 
    
    ${body}
    `;

    const generated = await executeLlmPrompt(prompt);
    if (generated) {
        writeObject(gameId, 'llm-summaries', generated);
    }

    return generated;
}