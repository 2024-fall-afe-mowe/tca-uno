import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { GameResult } from './game-results';
import { Player } from './App';
import { saveGameToCloud } from './uno-cloud-api';
import localforage from 'localforage';

interface PlayProps {
  players: Player[];
  addGameResult: (result: GameResult) => void;
  gameStartTime: string | null;
  setGameStartTime: (time: string | null) => void;
}

const Play: React.FC<PlayProps> = ({ players, addGameResult, gameStartTime, setGameStartTime }) => {
  const [unoDeclarations, setUnoDeclarations] = useState<{ [key: string]: number }>({});
  const [reverseCount, setReverseCount] = useState(0);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const playerColors = ['bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-500'];

  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await localforage.getItem<string>('email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };
    fetchEmail();
  }, []);

  const handleUnoDeclaration = (playerName: string) => {
    setUnoDeclarations((prev) => ({
      ...prev,
      [playerName]: (prev[playerName] || 0) + 1,
    }));
  };

  const handleWin = async (winner: string) => {
    if (!gameStartTime) {
      alert('The game has not started yet.');
      return;
    }

    const endTime = new Date().toISOString();

    const newGameResult: GameResult = {
      id: uuidv4(),
      startTime: gameStartTime,
      endTime,
      winner,
      players: players.map((p) => p.name),
      reverseCount,
      unoDeclarations,
    };

    try {
      if (email) {
        await saveGameToCloud(email, 'tca-uno-24f', endTime, newGameResult);
      }
      addGameResult(newGameResult);
      setGameStartTime(null); // Reset game start time after game ends
      navigate('/results');
    } catch (error) {
      console.error('Error saving game result to cloud:', error);
      alert('Failed to save the game result. Please check your internet connection and try again.');
    }
  };

  const toggleDirection = () => {
    setReverseCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="p-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Play</h1>

      {!gameStartTime ? (
        <p className="text-red-500">Please start the game in the Setup screen!</p>
      ) : (
        <>
          <div className="card bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xl mb-5">
            <div className="card-body flex flex-col items-center">
              <div className="text-9xl font-bold mb-3">
                {reverseCount % 2 === 0 ? '↻' : '↺'}
              </div>
              <button className="btn btn-primary" onClick={toggleDirection}>
                Reverse
              </button>
            </div>
          </div>

          <div className="text-center mb-5">
            <p className="text-xl">Total Reverses: {reverseCount}</p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {players.map((player, index) => (
              <div
                key={player.name}
                className={`rounded-lg border-4 p-6 shadow-lg text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center ${
                  playerColors[index % playerColors.length]
                }`}
              >
                <p className="text-3xl font-bold">{player.name}</p>
                <button
                  className="btn btn-primary mt-6 text-lg"
                  onClick={() => handleUnoDeclaration(player.name)}
                >
                  UNO!
                </button>

                {unoDeclarations[player.name] > 0 && (
                  <div className="mt-4 space-y-2">
                    <button
                      className="btn btn-success text-lg w-full"
                      onClick={() => handleWin(player.name)}
                    >
                      Win
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Play;
