import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameResult } from './game-results';

interface PlayProps {
    addNewGameResult: (gr: GameResult) => void;
}

export const Play: React.FC<PlayProps> = ({ addNewGameResult }) => {
    const nav = useNavigate();

    return (
        <div>
            <h1 className="text-xl font-bold mb-3">Play</h1>
            <button
                className="btn btn-success mb-3"
                onClick={() => {
                    addNewGameResult({
                        startTime: '',
                        endTime: '',
                        winner: 'Barbie',
                        players: ['Barbie', 'Ken'],
                    });
                    nav('/');
                }}
            >
                Game Over
            </button>
        </div>
    );
};
