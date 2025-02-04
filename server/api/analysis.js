import { readAllObjects, readObject, writeObject } from "../db/db.js";
import { convert } from 'html-to-text';

export async function runTeamAnalysis(req, res) {
    const allGames = readAllObjects('games-2024');
    // const g25 = readAllObjects('games-2025');
    // const allGames = g24.concat(g25);

    const teamMatches = {};
    // for each game find the winner and update its metric
    allGames.forEach(game => {
        const {
            gamePk,
            teams,
            season,
            officialDate
        } = game;

        // create payload
        let winner, score;
        if (game.teams.away.isWinner) {
            winner = game.teams.away.team.id;
            score = {
                win: game.teams.away.score,
                loss: game.teams.home.score
            }
        } else {
            winner = game.teams.home.team.id;
            score = {
                win: game.teams.home.score,
                loss: game.teams.away.score
            }
        }

        const payload = {
            gameId: gamePk,
            season,
            date: officialDate,
            homeTeam: teams.home.team,
            awayTeam: teams.away.team,
            venue: game.venue,
            dayNight: game.dayNight,
            winner,
            score
        };

        // add entry to both teams
        let first = teamMatches[payload.homeTeam.id];
        if (!first) {
            first = teamMatches[payload.homeTeam.id] = [];
        }
        first.push(payload);

        // second
        let second = teamMatches[payload.awayTeam.id];
        if (!second) {
            second = teamMatches[payload.awayTeam.id] = [];
        }
        second.push(payload);
    });

    writeObject('team-matches', 'analysis', teamMatches);
    res.json(teamMatches);
}


export async function runGameAnalysis(req, res) {
    const allGames = readAllObjects('games-content');
    // const g25 = readAllObjects('games-2025');
    // const allGames = g24.concat(g25);

    const summaries = {};
    // for each game find the winner and update its metric
    allGames.forEach(game => {
        // check if game is from 2024 season
        const date = game?.editorial?.recap?.mlb?.date;
        if(!date) {
            return;
        }

        if(!date.startsWith('2024')) {
            return;
        }

        const kall = game?.editorial?.recap?.mlb?.keywordsAll;
        // find in array where type is game_pk and read value attribute
        const gameId = kall?.find(item => item.type === 'game_pk')?.value;

        const mlbBody = game?.editorial?.recap?.mlb?.body;
        const seoTitle = game?.editorial?.recap?.mlb?.seoTitle;

        const imageTitle = game?.editorial?.recap?.mlb?.image?.title;
        const imageCuts = game?.editorial?.recap?.mlb?.image?.cuts;
        const videoCuts = game?.editorial?.recap?.mlb?.media?.playbacks;

        // filter videocuts object where name starts with 'mp4' and read 'url' attribute
        const videoUrl = videoCuts?.find(item => item.name.startsWith('mp4'))?.url;
        
        console.log(gameId, seoTitle);

        // create payload
        const payload = {
            gameId: gameId,
            title: seoTitle,
            imageTitle,
            imageUrl: imageCuts?.[0]?.src,
            videoUrl: videoUrl,
            body: convert(mlbBody || '')
        }

        summaries[payload.gameId] = payload;
    });

    writeObject('game-summaries', 'analysis', summaries);
    res.json(summaries);
}