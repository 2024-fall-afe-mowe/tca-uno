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

        addGameResult({
            startTime: now,
            endTime: now,
            winner,
            players: players.map((p) => p.name),
        });

        nav('/results');
    };

    const handleDidNotWin = () => {
        setUnoDeclared(null);
    };

    const getRandomUnoColor = () => {
        const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-3">Play</h1>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {players.map((player) => (
                    <div
                        key={player.name}
                        className={`rounded-lg p-4 shadow-lg text-white flex flex-col items-center justify-center ${getRandomUnoColor()}`}
                    >
                        <p className="text-xl font-bold">{player.name}</p>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={() => setUnoDeclared(player.name)}
                        >
                            UNO!
                        </button>
                    </div>
                ))}
            </div>
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

export default Play;
