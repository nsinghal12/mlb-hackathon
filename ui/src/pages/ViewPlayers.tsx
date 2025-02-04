import React from 'react';
import * as Service from '../Service';
import { sortObjects } from '../util/sortObjects';
import { useToast } from '../Toast';
import Field from '../components/Field';

const ViewPlayers = () => {
    const toast = useToast();

    const [players, setPlayers] = React.useState<any[]>([]);
    const [favorites, setFavorites] = React.useState<any>(undefined);
    const [filter, setFilter] = React.useState<string>("");

    React.useEffect(() => {
        const fetchPlayers = async () => {
            const players: Array<any> = await Service.getPlayers();
            players.sort(sortObjects)
            setPlayers(players);
        };

        const fetchFavorites = async () => {
            const favorites: Array<any> = await Service.getFavorites();
            setFavorites(favorites);
        };

        fetchPlayers();
        fetchFavorites();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter((e.target.value || '').toLowerCase());
    }

    const setFavoritePlayer = async (add, player) => {
        const updated = await Service.toggleFavoritePlayer(add, player.id);
        setFavorites(updated);

        if (add) {
            toast.info("Player " + player.fullName + " added to favorites");
        } else {
            toast.info("Player " + player.fullName + " removed from favorites");
        }
    }

    if (!players.length) {
        return <p>Loading...</p>;
    }

    let filteredPlayers = players;
    if (filter) {
        filteredPlayers = players.filter((player) => {
            return player.people[0].fullName.toLowerCase().includes(filter)
        });
    }

    const hasFavorites = favorites !== undefined

    return <div>
        <h2>Players</h2>

        <Field name='playerFilter' label='Filter' help='Search for your favorite player'>
            <input type='text' className="form-control" value={filter} onChange={handleFilterChange} />
        </Field>

        <table className="table">
            <thead>
                <tr>
                    <th>Player ID</th>
                    <th>Name</th>
                    <th>Height</th>
                    <th>Weight</th>
                    <th>Age</th>
                    <th>Draft Year</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {filteredPlayers.map((people) => {
                    const player = people.people[0];

                    return <tr key={player.id}>
                        <td>{player.id}</td>
                        <td>{player.fullName}</td>
                        <td>{player.height}</td>
                        <td>{player.weight}</td>
                        <td>{player.currentAge}</td>
                        <td>{player.draftYear}</td>
                        <td>
                            {hasFavorites
                                && (favorites.players[player.id] !== true
                                    ? <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => {
                                            setFavoritePlayer(true, player);
                                        }}
                                    >Add Favorite</button>
                                    : <button
                                        type="button"
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => {
                                            setFavoritePlayer(false, player);
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

export default ViewPlayers;
