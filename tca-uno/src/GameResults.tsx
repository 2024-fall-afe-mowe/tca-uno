import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameResult } from './game-results';

interface GameResultsProps {
    results: GameResult[];
}

const GameResults: React.FC<GameResultsProps> = ({ results }) => {
    const navigate = useNavigate();

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
                            <p><strong>Start Time:</strong> {result.startTime ? new Date(result.startTime).toLocaleString() : 'N/A'}</p>
                            <p><strong>End Time:</strong> {result.endTime ? new Date(result.endTime).toLocaleString() : 'N/A'}</p>
                        </li>
                    ))}
                </ul>
            )}
            <button
                className="btn btn-primary mt-4"
                onClick={() => navigate('/')}
            >
                Home
            </button>
        </div>
    );
};

export default GameResults;
