// src/GameResults.tsx
import React from 'react';
import { GameResult } from './game-results';

interface GameResultsProps {
    results: GameResult[];
}

const GameResults: React.FC<GameResultsProps> = ({ results }) => {
    return (
        <div>
            <h2 className="text-xl font-bold mb-3">Game Results</h2>
            {results.length === 0 ? (
                <p>No game results available.</p>
            ) : (
                <ul>
                    {results.map((result, index) => (
                        <li key={index} className="mb-2">
                            <p><strong>Winner:</strong> {result.winner}</p>
                            <p><strong>Players:</strong> {result.players.join(', ')}</p>
                            <p><strong>Start Time:</strong> {new Date(result.startTime).toLocaleString()}</p>
                            <p><strong>End Time:</strong> {new Date(result.endTime).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GameResults;
