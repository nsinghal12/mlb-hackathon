import React from 'react';
import * as Service from '../Service';
import { useToast } from '../Toast';

const Download = () => {
    const toast = useToast();

    const downloadTeam = async () => {
        const json = await Service.downloadTeams();
        toast.info(json.total + ' teams downloaded');
    }

    const downloadGames = async () => {
        const json = await Service.downloadGames();
        toast.info(json.total + ' games downloaded');
    }

    const downloadGamesContent = async () => {
        const json = await Service.downloadGamesContent();
        toast.info(json.total + ' games content downloaded');
    }

    const downloadGamesFeed = async () => {
        const json = await Service.downloadGamesFeed();
        toast.info(json.total + ' games feed downloaded');
    }

    const downloadPlayerData = async () => {
        const json = await Service.downloadPlayerData();
        toast.info(json.total + ' player data downloaded');
    }

    return <>
        <h2>Download</h2>
        <p>
            This page allows you to download the MLB data to local
            machine to run the analysis locally. You may click below
            to download a fresh copy of the data again.
        </p>
        <button type="button" className="btn btn-primary" onClick={downloadTeam}>Download Teams</button>
        <br /><br />
        <button type="button" className="btn btn-primary" onClick={downloadGames}>Download Games</button>
        <br /><br />
        <button type="button" className="btn btn-primary" onClick={downloadGamesContent}>Download Games Content</button>
        <br /><br />
        <button type="button" className="btn btn-primary" onClick={downloadGamesFeed}>Download Games Feed</button>
        <br /><br />
        <button type="button" className="btn btn-primary" onClick={downloadPlayerData}>Download Player Data</button>
    </>
}

export default Download;
