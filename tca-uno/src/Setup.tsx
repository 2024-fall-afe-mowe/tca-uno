import React, { useEffect } from 'react';
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

  const startGame = () => {
    if (players.some((p) => p.selected)) {
      setGameStartTime(new Date().toISOString());
      navigate('/play');
    } else {
      alert('Select at least one player to start the game.');
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Setup</h1>
      {players.length === 0 ? (
        <p className="text-red-500">No players available. Please add players to start the game.</p>
      ) : (
        <ul className="mb-5 space-y-2">
          {players.map((p, index) => (
            <li key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`player-${index}`}
                checked={p.selected}
                onChange={() => togglePlayerSelection(index)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor={`player-${index}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {p.name}
              </label>
            </li>
          ))}
        </ul>
      )}
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-gray-400"
        onClick={startGame}
        disabled={players.length === 0}
      >
        Start Game
      </button>
    </div>
  );
};

export default Setup;
