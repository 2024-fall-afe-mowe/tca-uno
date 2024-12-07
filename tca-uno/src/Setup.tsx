import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface Player {
    name: string;
    selected: boolean;
}

interface SetupProps {
    setPlayersForGame: (players: Player[]) => void;
}

export const Setup: React.FC<SetupProps> = ({ setPlayersForGame }) => {
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const validationDialogRef = useRef<HTMLDialogElement | null>(null);
    const nav = useNavigate();

    const addPlayer = () => {
        if (
            newPlayerName.length === 0 || 
            availablePlayers.some(player => player.name.toLowerCase() === newPlayerName.toLowerCase())
        ) {
            validationDialogRef.current?.showModal();
            return;
        }

        setAvailablePlayers(prevPlayers => [
            ...prevPlayers,
            { name: newPlayerName, selected: false }
        ]);
        setNewPlayerName('');
    };

    const togglePlayerSelection = (playerName: string) => {
        setAvailablePlayers(prevPlayers =>
            prevPlayers.map(player =>
                player.name === playerName
                    ? { ...player, selected: !player.selected }
                    : player
            )
        );
    };

    const startGame = () => {
        const selectedPlayers = availablePlayers.filter(player => player.selected);
        if (selectedPlayers.length < 2) {
            validationDialogRef.current?.showModal();
            return;
        }
        setPlayersForGame(selectedPlayers);
        nav('/play');
    };

    return (
        <div className="setup-container">
            <h1 className="text-2xl font-bold mb-3">Setup</h1>
            <div className="flex mb-3">
                <input
                    type="text"
                    placeholder="Enter player name"
                    className="input input-bordered flex-1"
                    value={newPlayerName}
                    onChange={e => setNewPlayerName(e.target.value)}
                />
                <button className="btn btn-primary ml-2" onClick={addPlayer}>
                    Add Player
                </button>
            </div>

            <ul>
                {availablePlayers.map(player => (
                    <li key={player.name} className="flex items-center mb-2">
                        <label className="cursor-pointer flex-1">
                            <input
                                type="checkbox"
                                className="checkbox mr-2"
                                checked={player.selected}
                                onChange={() => togglePlayerSelection(player.name)}
                            />
                            {player.name}
                        </label>
                    </li>
                ))}
            </ul>

            <button
                className="btn btn-success mt-3 w-full"
                onClick={startGame}
            >
                Start Game
            </button>

            <dialog ref={validationDialogRef} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">
                        {
                            availablePlayers.length < 2
                                ? 'Not enough players selected!'
                                : 'Duplicate or empty player name!'
                        }
                    </h3>
                    <p className="py-4">
                        {
                            availablePlayers.length < 2
                                ? 'Please select at least two players to start the game.'
                                : 'Enter a unique name for each player.'
                        }
                    </p>
                </div>
            </dialog>
        </div>
    );
};
