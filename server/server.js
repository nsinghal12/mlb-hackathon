import express from 'express';
import asyncHandler from 'express-async-handler';
import cors from 'cors';

import downloadTeams from './api/download-teams.js';
import hello from './api/hello.js';
import downloadGames from './api/download-games.js';
import { getTeams, getTeam } from './api/team.js';
import getSchedule from './api/schedule.js';
import getGames from './api/games.js';
import downloadGamesFeed from './api/download-games-feed.js';
import downloadGamesContent from './api/download-games-content.js';
import downloadPlayers from './api/download-player.js';
import { getPlayers, getPlayer } from './api/players.js';
import { getFavorites, updateFavorites } from './api/favorites.js';
import { createDigest, getDigests, getParticularDigest } from './api/digest.js';
import { runGameAnalysis, runTeamAnalysis } from './api/analysis.js';

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Define routes
app.get('/', hello);
app.get('/download/teams', asyncHandler(downloadTeams));
app.get('/download/games', asyncHandler(downloadGames));
app.get('/teams', asyncHandler(getTeams));
app.get('/teams/:teamId', asyncHandler(getTeam));
app.get('/games', asyncHandler(getGames));
app.get('/schedule', asyncHandler(getSchedule));
app.get('/download/games/content', asyncHandler(downloadGamesContent));
app.get('/download/games/feed', asyncHandler(downloadGamesFeed));
app.get('/download/players', asyncHandler(downloadPlayers));
app.get('/players', asyncHandler(getPlayers));
app.get('/players/:playerId', asyncHandler(getPlayer));
app.get('/favorites', asyncHandler(getFavorites));
app.post('/favorites', asyncHandler(updateFavorites));

app.get('/digests', asyncHandler(getDigests));
app.get('/digests/:digestId', asyncHandler(getParticularDigest));
app.post('/digests', asyncHandler(createDigest));

app.get('/analysis/teams', asyncHandler(runTeamAnalysis));
app.get('/analysis/games', asyncHandler(runGameAnalysis));

// Start the server
app.listen(port, () => {
    console.log(`MLB Hackathon server listening on port ${port}`);
});
