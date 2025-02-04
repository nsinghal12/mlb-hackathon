import React, { useEffect } from 'react';
import * as Service from '../Service';
import { useToast } from '../Toast';
import Field from '../components/Field';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    max-width: 740px;
`;

const CreateDigest = () => {
    const toast = useToast();
    const navigate = useNavigate();

    const [date, setDate] = React.useState<string>('2024-08-31');
    const [duration, setDuration] = React.useState<string>('week');
    const [favorites, setFavorites] = React.useState<any>(undefined);

    useEffect(() => {
        const fetchFavorites = async () => {
            const favorites: any = await Service.getFavorites();

            const favData = {
                teams: [],
                players: []
            }

            const teamIds = Object.keys(favorites.teams || {});
            for (let index = 0; index < teamIds.length; index++) {
                const teamId = teamIds[index];
                const teamData = await Service.getTeam(teamId);
                favData.teams.push(teamData);
            }

            const playerIds = Object.keys(favorites.players || {});
            for (let index = 0; index < playerIds.length; index++) {
                const playerId = playerIds[index];
                const playerData = await Service.getPlayer(playerId);
                favData.players.push(playerData);
            }

            console.log(favData);
            setFavorites(favData);
        };

        fetchFavorites();
    }, []);

    const createDigest = async () => {
        const json = await Service.createDigest(date, duration);
        const id = json.id;
        toast.info('Digest created succesfully.');
        navigate(`/digests/${id}`);
        return;
    }

    const setDateForDigest = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    }

    const setDurationForDigest = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDuration(e.target.value);
    }

    return <Container>
        <h2>Create Digest</h2>

        <div className='form-label'>Your favorite teams</div>
        <ul>
            {
                favorites?.teams.map((team: any) => {
                    return <li key={team.id} value={team.id}>{team.name}</li>
                })
            }
        </ul>
        <div className='form-label'>Your favorite players</div>
        <ul>
            {
                favorites?.players.map((player: any) => {
                    return <li key={player.id} value={player.id}>{player.fullName}</li>
                })
            }
        </ul>
        <form className="row g-3">
            <Field name='digestDate' label='Digest Date' help='Select the date for the digest'>
                <input type="date" className="form-control" onChange={setDateForDigest} value={date} />
            </Field>
            <Field name='duration' label='Duration' help='Select the duration for the digest'>
                <select className="form-select form-select mb-3" aria-label="Select duration" value={duration} onChange={setDurationForDigest}>
                    <option value="week">Weekly</option>
                    <option value="month">Month</option>
                    <option value="season">Season</option>
                </select>
            </Field>
        </form >

        <button type="button" className="btn btn-primary" onClick={createDigest}>Create Digest</button>
    </Container>
}

export default CreateDigest;
