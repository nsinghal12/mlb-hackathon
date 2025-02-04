import React from 'react';
import * as Service from '../Service';
import { useToast } from '../Toast';
import Button from '../components/Button';

const Analysis = () => {
    const toast = useToast();

    const onTeamAnalysis = async () => {
        const json = await Service.runTeamAnalysis();
        console.log('analysis: ', json);
        toast.info('Team analysis complete');
    }

    const extractGameInfo = async () => {
        const json = await Service.extractGameInfo();
        console.log('extract: ', json);
        toast.info('Game info extraction complete');
    }

    return <>
        <h2>Analysis</h2>
        <br /><br />
        <Button label="Run team analysis for 2024 season" onClick={onTeamAnalysis} />
        <br /><br />
        <Button label="Run game analysis for 2024 season" onClick={extractGameInfo} />
    </>
}

export default Analysis;
