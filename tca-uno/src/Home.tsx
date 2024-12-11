import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeaderboardEntry, FunFacts, getLeaderboard, calculateFunFacts } from './game-results';
import { loadGamesFromCloud } from './uno-cloud-api';
import localforage from 'localforage';

interface HomeProps {
    setEmailForCloudApi: (email: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setEmailForCloudApi }) => {
    const navigate = useNavigate();

    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const savedEmail = (await localforage.getItem<string>('email')) || '';
                setEmail(savedEmail);

                if (savedEmail) {
                    const results = await loadGamesFromCloud(savedEmail, 'tca-uno-24f');
                    setLeaderboardData(getLeaderboard(results));
                    setFunFacts(calculateFunFacts(results));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        await localforage.setItem('email', newEmail);
        setEmailForCloudApi(newEmail);
    };

    return (
        <div className="p-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-3">Home</h1>
            <input
                type="email"
                className="input input-bordered mb-3 w-full bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                id="email-input"
                name="email"
            />
            <button className="btn btn-primary mb-3 w-full" onClick={() => navigate('/setup')}>
                Play
            </button>
            <div className="card bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xl mb-5">
                <div className="card-body p-3">
                    <h2 className="card-title">Leaderboard</h2>
                    {leaderboardData.length > 0 ? (
                        <table className="table w-full">
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
                        <p>No leaderboard data available</p>
                    )}
                </div>
            </div>
            <div className="card bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xl">
                <div className="card-body p-3">
                    <h2 className="card-title">Fun Facts</h2>
                    <ul className="list-disc list-inside">
                        <li>Total Games Played: {funFacts.totalGames}</li>
                        <li>Total Reverses: {funFacts.totalReverses}</li>
                        <li>Total UNO Declarations: {funFacts.totalUnoDeclarations}</li>
                        <li>Average Reverses per Game: {funFacts.averageReversesPerGame}</li>
                        <li>Average UNO Declarations per Game: {funFacts.averageUnoDeclarationsPerGame}</li>
                        <li>Highest Reverses in a Single Game: {funFacts.highestReversesInGame}</li>
                        <li>Highest UNO Declarations in a Single Game: {funFacts.highestUnoDeclarationsInGame}</li>
                        <li>Last Played: {funFacts.lastPlayed}</li>
                        <li>Shortest Game: {funFacts.shortestGame}</li>
                        <li>Longest Game: {funFacts.longestGame}</li>
                        <li>Average Game Duration: {funFacts.averageGameDuration}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;
