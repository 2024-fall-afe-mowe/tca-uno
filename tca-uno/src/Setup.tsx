import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from './App';

interface SetupProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

const Setup: React.FC<SetupProps> = ({ players, setPlayers }) => {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const addPlayer = () => {
    const trimmedName = playerName.trim();
    if (trimmedName !== '') {
      setPlayers((prev) => [...prev, { name: trimmedName, selected: true }]);
      setPlayerName('');
    }
  };

  const togglePlayerSelected = (index: number) => {
    setPlayers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], selected: !updated[index].selected };
      return updated;
    });
  };

  const startGame = () => {
    if (players.some(p => p.selected)) {
      navigate('/play');
    } else {
      alert('Select at least one player to start the game.');
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Setup</h1>
      <div className="mb-4">
        <input
          type="text"
          className="input input-bordered mr-2"
          placeholder="Enter player name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addPlayer}>Add Player</button>
      </div>

      {players.length > 0 && (
        <ul className="mb-4 space-y-2">
          {players.map((p, i) => (
            <li key={i} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={p.selected}
                onChange={() => togglePlayerSelected(i)}
              />
              <span>{p.name}</span>
            </li>
          ))}
        </ul>
      )}

      <button className="btn btn-success" onClick={startGame}>Start Game</button>
    </div>
  );
};

export default Setup;
