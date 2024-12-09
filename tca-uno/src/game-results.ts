export interface GameResult {
    startTime: string;
    endTime: string;
    winner: string;
    players: string[];
    reverseCount: number;
    unoDeclarations: { [key: string]: number };
}

export interface LeaderboardEntry {
    name: string;
    wins: number;
    losses: number;
    avg: string;
}

export interface FunFacts {
    totalGames: number;
    totalReverses: number;
    totalUnoDeclarations: number;
    averageReversesPerGame: number;
    averageUnoDeclarationsPerGame: number;
    highestReversesInGame: number;
    highestUnoDeclarationsInGame: number;
}

export function getLeaderboard(gameResults: GameResult[]): LeaderboardEntry[] {
    const previousPlayers = Array.from(new Set(gameResults.flatMap((result) => result.players)));
    return previousPlayers.map((player) => {
        const gamesPlayed = gameResults.filter((result) => result.players.includes(player));
        const wins = gamesPlayed.filter((result) => result.winner === player).length;
        const losses = gamesPlayed.length - wins;
        const avg = gamesPlayed.length ? (wins / gamesPlayed.length).toFixed(3) : "0.000";

        return { name: player, wins, losses, avg };
    }).sort((a, b) => parseFloat(b.avg) - parseFloat(a.avg));
}

export function calculateFunFacts(gameResults: GameResult[]): FunFacts {
    const totalGames = gameResults.length;
    const totalReverses = gameResults.reduce((sum, game) => sum + game.reverseCount, 0);
    const totalUnoDeclarations = gameResults.reduce(
        (sum, game) => sum + Object.values(game.unoDeclarations).reduce((a, b) => a + b, 0),
        0
    );
    const averageReversesPerGame = totalGames ? totalReverses / totalGames : 0;
    const averageUnoDeclarationsPerGame = totalGames ? totalUnoDeclarations / totalGames : 0;
    const highestReversesInGame = Math.max(...gameResults.map((game) => game.reverseCount), 0);
    const highestUnoDeclarationsInGame = Math.max(
        ...gameResults.map((game) => Object.values(game.unoDeclarations).reduce((a, b) => a + b, 0)),
        0
    );

    return {
        totalGames,
        totalReverses,
        totalUnoDeclarations,
        averageReversesPerGame,
        averageUnoDeclarationsPerGame,
        highestReversesInGame,
        highestUnoDeclarationsInGame,
    };
}
