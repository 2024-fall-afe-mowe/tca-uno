import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LeaderboardEntry } from './game-results';

interface HomeProps {
    leaderboardData: LeaderboardEntry[];
}

export const Home: React.FC<HomeProps> = ({ leaderboardData }) => {
    const nav = useNavigate();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-3">Home</h1>
            <button
                className="btn btn-primary mb-3"
                onClick={() => nav('/setup')}
            >
                Play
            </button>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-3">
                    <h2 className="card-title">Leaderboard</h2>
                    {leaderboardData.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>W</th>
                                    <th>L</th>
                                    <th>AVG</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.map((entry) => (
                                    <tr key={entry.name}>
                                        <td>{entry.wins}</td>
                                        <td>{entry.losses}</td>
                                        <td>{entry.avg}</td>
                                        <td>{entry.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Play a game to see the leaderboard!</p>
                    )}
                </div>
            </div>
        </div>
    );
};
