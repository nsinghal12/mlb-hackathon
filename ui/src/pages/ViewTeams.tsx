import React from 'react';
import * as Service from '../Service';
import { sortObjects } from '../util/sortObjects';
import Field from '../components/Field';
import { useToast } from '../Toast';

const ViewTeams = () => {
    const toast = useToast();

    const [teams, setTeams] = React.useState<any[]>([]);
    const [favorites, setFavorites] = React.useState<any>(undefined);
    const [filter, setFilter] = React.useState<string>("");

    React.useEffect(() => {
        const fetchTeams = async () => {
            const teams: Array<any> = await Service.getTeamData();
            teams.sort(sortObjects);
            setTeams(teams);
        };

        const fetchFavorites = async () => {
            const favorites: Array<any> = await Service.getFavorites();
            setFavorites(favorites);
        };

        fetchTeams();
        fetchFavorites();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter((e.target.value || '').toLowerCase());
    }

    const setFavoriteTeam = async (add, team) => {
        const updated = await Service.toggleFavoriteTeam(add, team.id);
        setFavorites(updated);

        if (add) {
            toast.info("Team " + team.name + " added to favorites");
        } else {
            toast.info("Team " + team.name + " removed from favorites");
        }
    }

    if (!teams.length) {
        return <p>Loading...</p>;
    }

    let filteredTeams = teams;
    if (filter) {
        filteredTeams = teams.filter((team) => {
            return team.name.toLowerCase().includes(filter)
        });
    }

    const hasFavorites = favorites !== undefined

    return <div>
        <h2>Teams</h2>

        <Field name='teamFilter' label='Filter' help='Search for your favorite team'>
            <input type='text' className="form-control" value={filter} onChange={handleFilterChange} />
        </Field>

        <table className="table">
            <thead>
                <tr>
                    <th>Team ID</th>
                    <th>Team Name</th>
                    {/* <th>Active</th> */}
                    <th>First played</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {filteredTeams.length === 0 && <tr>
                    <td colSpan={4}>No teams found</td>
                </tr>}
                {filteredTeams.map((team) => {
                    return <tr key={team.id}>
                        <td>{team.id}</td>
                        <td>{team.name}</td>
                        {/* <td>{"" + team.active}</td> */}
                        <td>{team.firstYearOfPlay}</td>
                        <td>
                            {hasFavorites
                                && (favorites.teams[team.id] !== true
                                    ? <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => {
                                            setFavoriteTeam(true, team);
                                        }}
                                    >Add Favorite</button>
                                    : <button
                                        type="button"
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => {
                                            setFavoriteTeam(false, team);
                                        }}
                                    >Remove Favorite</button>
                                )
                            }
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>
}

export default ViewTeams;
