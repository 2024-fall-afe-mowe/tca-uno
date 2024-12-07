export type GameResult = {
    startTime: string;
    endTime: string;
    winner: string;
    players: string[];
};

export type LeaderboardEntry = {
    wins: number;
    losses: number;
    avg: string; // Average win percentage as a formatted string
    name: string; // Player's name
};

// Main function to generate leaderboard
export const getLeaderboard = (results: GameResult[]): LeaderboardEntry[] => {
    return getPreviousPlayers(results)
        .map((player) => getLeaderboardEntry(results, player))
        .sort(
            (a, b) =>
                parseFloat(b.avg) * 1000 + b.wins + b.losses -
                (parseFloat(a.avg) * 1000 + a.wins + a.losses)
        );
};

// Helper function to extract unique players
const getPreviousPlayers = (results: GameResult[]): string[] => {
    const allPlayers = results.flatMap((game) => game.players);
    return Array.from(new Set(allPlayers)).sort((a, b) => a.localeCompare(b));
};

// Helper function to calculate stats for a single player
const getLeaderboardEntry = (results: GameResult[], player: string): LeaderboardEntry => {
    const playerWins = results.filter((game) => game.winner === player).length;

    const playerGames = results.filter((game) =>
        game.players.includes(player)
    ).length;

    return {
        wins: playerWins,
        losses: playerGames - playerWins,
        avg: playerGames > 0 ? (playerWins / playerGames).toFixed(3) : '0.000',
        name: player,
    };
};
