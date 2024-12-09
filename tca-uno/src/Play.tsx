import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameResult } from './game-results';
import { Player } from './App';

interface PlayProps {
    players: Player[];
    addGameResult: (result: GameResult) => void;
}

export const Play: React.FC<PlayProps> = ({ players, addGameResult }) => {
    const [unoDeclarations, setUnoDeclarations] = useState<{ [key: string]: boolean }>({});
    const [direction, setDirection] = useState<'clockwise' | 'counterclockwise'>('clockwise');
    const [reverseCount, setReverseCount] = useState(0);
    const navigate = useNavigate();

    const handleUnoDeclaration = (playerName: string) => {
        setUnoDeclarations((prev) => ({
            ...prev,
            [playerName]: !prev[playerName],
        }));
    };

    const handleWin = (winner: string) => {
        const now = new Date().toISOString();

        // Convert boolean unoDeclarations to numeric counts
        const unoNumbers: { [key: string]: number } = {};
        for (const p of players) {
            unoNumbers[p.name] = unoDeclarations[p.name] ? 1 : 0;
        }

        addGameResult({
            startTime: now,
            endTime: now,
            winner,
            players: players.map((p) => p.name),
            reverseCount: reverseCount,
            unoDeclarations: unoNumbers,
        });

        navigate('/results');
    };

    const toggleDirection = () => {
        setDirection((prevDirection) =>
            prevDirection === 'clockwise' ? 'counterclockwise' : 'clockwise'
        );
        setReverseCount((prevCount) => prevCount + 1);
    };

    const getDirectionIcon = () => {
        return direction === 'clockwise' ? '↻' : '↺';
    };

    const unoColors = ['bg-blue-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'];

    return (
        <div className="p-5">
            <h1 className="text-3xl font-bold mb-5">Play</h1>

            <div className="card bg-base-100 shadow-xl mb-5">
                <div className="card-body flex flex-col items-center">
                    <div className="text-9xl font-bold mb-3">
                        {getDirectionIcon()}
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
                        className={`rounded-lg border-4 border-white p-6 shadow-lg text-white flex flex-col items-center justify-center ${unoColors[index % unoColors.length]}`}
                    >
                        <p className="text-3xl font-bold">{player.name}</p>
                        <button
                            className="btn btn-primary mt-6 text-lg"
                            onClick={() => handleUnoDeclaration(player.name)}
                        >
                            UNO!
                        </button>

                        {unoDeclarations[player.name] && (
                            <div className="mt-4 space-y-2">
                                <button
                                    className="btn btn-success text-lg w-full"
                                    onClick={() => handleWin(player.name)}
                                >
                                    Win
                                </button>
                                <button
                                    className="btn btn-error text-lg w-full"
                                    onClick={() => handleUnoDeclaration(player.name)}
                                >
                                    Didn't Win
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Play;
