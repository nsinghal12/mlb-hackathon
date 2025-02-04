import React from 'react';
import * as Service from '../Service';
import { sortObjects } from '../util/sortObjects';

const ViewGames = () => {
    const [games, setGames] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchGames = async () => {
            const games:Array<any> = await Service.getGames();
            games.sort(sortObjects)
            setGames(games);
        };

        fetchGames();
    }, []);

    if (!games.length) {
        return <p>Loading...</p>;
    }

    return <div>
        <h2>Games</h2>
        <table className="table">
            <thead>
                <tr>
                    <th>Game ID</th>
                    <th>Season</th>
                    <th>Date</th>
                    <th>Home Team</th>
                    <th>Away Team</th>
                    <th>Home Score</th>
                    <th>Away Score</th>
                </tr>
            </thead>
            <tbody>
                {games.map((game) => {
                    return <tr key={game.gamePk}>
                        <td>{game.gamePk}</td>
                        <td>{game.season}</td>
                        <td>{game.officialDate}</td>
                        <td>{game.teams.home.team.name}</td>
                        <td>{game.teams.away.team.name}</td>
                        <td>{game.homeScore}</td>
                        <td>{game.awayScore}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>
}

export default ViewGames;
