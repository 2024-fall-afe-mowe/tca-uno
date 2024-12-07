import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameResult } from './game-results';

interface PlayProps {
    players: { name: string; selected: boolean }[];
    addGameResult: (result: GameResult) => void;
}

export const Play: React.FC<PlayProps> = ({ players, addGameResult }) => {
    const [unoDeclared, setUnoDeclared] = useState<string | null>(null);
    const nav = useNavigate();

    const handleWin = (winner: string) => {
        const now = new Date().toISOString();

        // Record the game result and navigate to results page
        addGameResult({
            startTime: now, // You could replace this with actual game start time if available
            endTime: now,
            winner,
            players: players.map(p => p.name),
        });

        nav('/results');
    };

    const handleDidNotWin = () => {
        // Reset UNO declaration
        setUnoDeclared(null);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-3">Play</h1>
            <p className="mb-3">Current Players:</p>
            <ul className="list-disc pl-5">
                {players.map(player => (
                    <li key={player.name} className="mb-2">
                        {player.name}
                        {unoDeclared === null && (
                            <button
                                className="btn btn-warning ml-3"
                                onClick={() => setUnoDeclared(player.name)}
                            >
                                UNO!
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            {unoDeclared && (
                <div className="mt-5">
                    <p className="mb-3 text-lg">
                        <strong>{unoDeclared}</strong> declared UNO!
                    </p>
                    <button
                        className="btn btn-success mr-3"
                        onClick={() => handleWin(unoDeclared)}
                    >
                        Win
                    </button>
                    <button className="btn btn-error" onClick={handleDidNotWin}>
                        Didn't Win
                    </button>
                </div>
            )}
        </div>
    );
};
