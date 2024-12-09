import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Play } from './Play';
import GameResults from './GameResults';
import Home from './Home';
import Setup from './Setup';
import { GameResult, getLeaderboard, calculateFunFacts } from './game-results';

export interface Player {
  name: string;
  selected: boolean;
}

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);

  const addGameResult = (result: GameResult) => {
    setGameResults((prev) => [...prev, result]);
  };

  const leaderboardData = getLeaderboard(gameResults);
  const funFacts = calculateFunFacts(gameResults);

  // Only selected players will be included in the Play screen
  const activePlayers = players.filter(p => p.selected);

  return (
    <Router>
      <div className="p-5">
        <nav className="mb-4 space-x-4">
          <Link to="/">Home</Link>
          <Link to="/setup">Setup</Link>
          <Link to="/play">Play</Link>
          <Link to="/results">Results</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home leaderboardData={leaderboardData} funFacts={funFacts} />} />
          <Route path="/setup" element={<Setup players={players} setPlayers={setPlayers} />} />
          <Route path="/play" element={<Play players={activePlayers} addGameResult={addGameResult} />} />
          <Route path="/results" element={<GameResults results={gameResults} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
