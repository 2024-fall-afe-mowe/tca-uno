import React, { useState, useEffect } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Home } from './Home';
import { Setup } from './Setup';
import { Play } from './Play';
import GameResults from './GameResults';
import { GameResult, getLeaderboard } from './game-results';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface Player {
    name: string;
    selected: boolean;
}

const dummyGameResults: GameResult[] = [
    {
        startTime: '2024-09-23T15:36:25.123Z',
        endTime: '2024-09-23T15:46:25.123Z',
        winner: 'Chris B',
        players: ['Chris B', 'Caden J', 'Peter B', 'Swastik A', 'Tom'],
    },
];

const App: React.FC = () => {
    const [gameResults, setGameResults] = useState<GameResult[]>(dummyGameResults);
    const [currentPlayers, setCurrentPlayers] = useState<Player[]>([]);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const addGameResult = (newResult: GameResult) => {
        setGameResults([...gameResults, newResult]);
    };

    const myRouter = createHashRouter([
        {
            path: '/',
            element: <Home leaderboardData={getLeaderboard(gameResults)} />,
        },
        { path: '/setup', element: <Setup setPlayersForGame={setCurrentPlayers} /> },
        { path: '/play', element: <Play players={currentPlayers} addGameResult={addGameResult} /> },
        { path: '/results', element: <GameResults results={gameResults} /> },
    ]);

    return (
        <div className="App p-3 relative min-h-screen bg-base-100 text-base-content">
            <button
                className="absolute top-4 right-4 p-2 rounded-full focus:outline-none"
                onClick={toggleTheme}
                aria-label="Toggle Dark Mode"
            >
                {theme === 'light' ? (
                    <MoonIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                ) : (
                    <SunIcon className="w-6 h-6 text-yellow-500" />
                )}
            </button>
            <RouterProvider router={myRouter} />
        </div>
    );
};

export default App;
