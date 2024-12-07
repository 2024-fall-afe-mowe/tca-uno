import React, { useState } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Home } from './Home';
import { Setup } from './Setup';
import { Play } from './Play';
import GameResults from './GameResults';
import { GameResult, getLeaderboard } from './game-results';

const dummyGameResults: GameResult[] = [
    {
        startTime: '2024-09-23T15:36:25.123Z',
        endTime: '2024-09-23T15:46:25.123Z',
        winner: 'Chris B',
        players: ['Chris B', 'Caden J', 'Peter B', 'Swastik A', 'Tom'],
    },
    {
        startTime: '2024-09-23T15:48:25.123Z',
        endTime: '2024-09-23T15:50:25.123Z',
        winner: 'Tom',
        players: ['Harry', 'Hermione', 'Ron', 'Tom'],
    },
];

const App: React.FC = () => {
    const [gameResults, setGameResults] = useState<GameResult[]>(dummyGameResults);

    // Add a new game result
    const addNewGameResult = (newResult: GameResult) => {
        setGameResults([...gameResults, newResult]);
    };

    const myRouter = createHashRouter([
        {
            path: '/',
            element: <Home leaderboardData={getLeaderboard(gameResults)} />,
        },
        {
            path: '/setup',
            element: <Setup />,
        },
        {
            path: '/play',
            element: <Play addNewGameResult={addNewGameResult} />,
        },
        {
            path: '/results',
            element: <GameResults results={gameResults} />,
        },
    ]);

    return (
        <div className="App p-3">
            <RouterProvider router={myRouter} />
        </div>
    );
};

export default App;
