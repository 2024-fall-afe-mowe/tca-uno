import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from './App';
import { loadGamesFromCloud } from './uno-cloud-api';
import localforage from 'localforage';

interface SetupProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setGameStartTime: (time: string) => void;
  startGame: () => void; 
}

const Setup: React.FC<SetupProps> = ({ players, setPlayers, setGameStartTime }) => {
  const navigate = useNavigate();
  const [newPlayerName, setNewPlayerName] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      const savedEmail = await localforage.getItem<string>('email');
      if (!savedEmail) {
        console.warn('No email found in local storage.');
        return;
      }

      try {
        const results: { players: string[] }[] = await loadGamesFromCloud(savedEmail, 'tca-uno-24f');
        const playerSet = new Set<string>();
        results.forEach((result) => {
          result.players.forEach((name) => playerSet.add(name));
        });
        const uniquePlayers = Array.from(playerSet).map((name) => ({ name, selected: false }));
        setPlayers(uniquePlayers);
      } catch (error) {
        console.error('Error loading players from cloud:', error);
      }
    };

    fetchPlayers();
  }, [setPlayers]);

  const togglePlayerSelection = (index: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, i) =>
        i === index ? { ...player, selected: !player.selected } : player
      )
    );
  };

  const addNewPlayer = () => {
    if (newPlayerName.trim() === '') {
      alert('Player name cannot be empty.');
      return;
    }

    if (players.some((player) => player.name.toLowerCase() === newPlayerName.toLowerCase())) {
      alert('Player name already exists.');
      return;
    }

    setPlayers((prevPlayers) => [...prevPlayers, { name: newPlayerName.trim(), selected: false }]);
    setNewPlayerName('');
  };

  const startGame = () => {
    if (players.some((p) => p.selected)) {
      setGameStartTime(new Date().toISOString());
      navigate('/play');
    } else {
      alert('Select at least one player to start the game.');
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Setup</h1>
      <div className="mb-5">
        <input
          type="text"
          className="input input-bordered mr-3"
          placeholder="Enter player name"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addNewPlayer}>
          Add Player
        </button>
      </div>
      {players.length === 0 ? (
        <p className="text-red-500">No players available. Please add players to start the game.</p>
      ) : (
        <ul className="mb-5">
          {players.map((p, index) => (
            <li key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`player-${index}`}
                checked={p.selected}
                onChange={() => togglePlayerSelection(index)}
              />
              <label htmlFor={`player-${index}`} className="ml-2">
                {p.name}
              </label>
            </li>
          ))}
        </ul>
      )}
      <button
        className="btn btn-success"
        onClick={startGame}
        disabled={players.length === 0}
      >
        Start Game
      </button>
    </div>
  );
};

export default Setup;
