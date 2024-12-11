import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'; // Import Heroicons
import Play from './Play';
import GameResults from './GameResults';
import Home from './Home';
import Setup from './Setup';
import { saveGameToCloud, loadGamesFromCloud } from './uno-cloud-api';
import { GameResult, FunFacts, calculateFunFacts } from './game-results';

export interface Player {
  name: string;
  selected: boolean;
}

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [funFacts, setFunFacts] = useState<FunFacts>({
    totalGames: 0,
    totalReverses: 0,
    totalUnoDeclarations: 0,
    averageReversesPerGame: 0,
    averageUnoDeclarationsPerGame: 0,
    highestReversesInGame: 0,
    highestUnoDeclarationsInGame: 0,
    lastPlayed: 'N/A',
    shortestGame: 'N/A',
    longestGame: 'N/A',
    averageGameDuration: 'N/A',
  });
  const [email, setEmail] = useState('');
  const [gameStartTime, setGameStartTime] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state based on localStorage or system preference
    if (localStorage.theme) {
      return localStorage.theme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply or remove the 'dark' class on the document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchData = async () => {
      if (email) {
        try {
          const results = await loadGamesFromCloud(email, 'tca-uno-24f');
          setGameResults(results);
          setFunFacts(calculateFunFacts(results));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [email]);

  const addGameResult = async (result: GameResult) => {
    const updatedResults = [...gameResults, result];
    setGameResults(updatedResults);
    setFunFacts(calculateFunFacts(updatedResults));
    try {
      await saveGameToCloud(email, 'tca-uno-24f', result.endTime, result);
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };

  const startGame = () => {
    if (players.some((p) => p.selected)) {
      setGameStartTime(new Date().toISOString());
    } else {
      alert('Select at least one player to start the game.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800">
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/setup" className="hover:underline">Setup</Link>
          <Link to="/play" className="hover:underline">Play</Link>
          <Link to="/results" className="hover:underline">Results</Link>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-500" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-500" />
          )}
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<Home setEmailForCloudApi={setEmail} />} />
        <Route
          path="/setup"
          element={
            <Setup
              players={players}
              setPlayers={setPlayers}
              setGameStartTime={setGameStartTime}
              startGame={startGame}
            />
          }
        />
        <Route
          path="/play"
          element={
            <Play
              players={players.filter((p) => p.selected)}
              addGameResult={addGameResult}
              gameStartTime={gameStartTime}
              setGameStartTime={setGameStartTime}
            />
          }
        />
        <Route
          path="/results"
          element={<GameResults results={gameResults} funFacts={funFacts} />}
        />
      </Routes>
    </div>
  );
}

export default App;
