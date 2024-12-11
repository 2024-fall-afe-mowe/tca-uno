import { durationFormatter } from 'human-readable';

const formatGameDuration = durationFormatter<string>();
const formatLastPlayed = durationFormatter<string>({
  allowMultiples: ['y', 'mo', 'd'],
});

// Type definitions
export interface GameResult {
  id: string; // Unique identifier for the game
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
  lastPlayed: string;
  shortestGame: string;
  longestGame: string;
  averageGameDuration: string;
}

// Calculate leaderboard
export function getLeaderboard(gameResults: GameResult[]): LeaderboardEntry[] {
  const previousPlayers = Array.from(new Set(gameResults.flatMap((result) => result.players)));
  return previousPlayers
    .map((player) => {
      const gamesPlayed = gameResults.filter((result) => result.players.includes(player));
      const wins = gamesPlayed.filter((result) => result.winner === player).length;
      const losses = gamesPlayed.length - wins;
      const avg = gamesPlayed.length ? (wins / gamesPlayed.length).toFixed(3) : '0.000';

      return { name: player, wins, losses, avg };
    })
    .sort((a, b) => parseFloat(b.avg) - parseFloat(a.avg));
}

// Calculate fun facts
export function calculateFunFacts(gameResults: GameResult[]): FunFacts {
  const totalGames = gameResults.length;
  const totalReverses = gameResults.reduce((sum, game) => sum + game.reverseCount, 0);
  const totalUnoDeclarations = gameResults.reduce(
    (sum, game) => {
      const unoDeclarations = game.unoDeclarations || {};  // Safe fallback to avoid null/undefined
      return sum + Object.values(unoDeclarations).reduce((a, b) => a + b, 0);
    },
    0
  );

  const averageReversesPerGame = totalGames ? totalReverses / totalGames : 0;
  const averageUnoDeclarationsPerGame = totalGames ? totalUnoDeclarations / totalGames : 0;

  const gameDurations = gameResults.map(
    (game) => Date.parse(game.endTime) - Date.parse(game.startTime)
  );

  const shortestGame = totalGames > 0 ? formatGameDuration(Math.min(...gameDurations)) : 'n/a';
  const longestGame = totalGames > 0 ? formatGameDuration(Math.max(...gameDurations)) : 'n/a';
  const averageGameDuration =
    totalGames > 0
      ? formatGameDuration(gameDurations.reduce((a, b) => a + b, 0) / totalGames)
      : 'n/a';

  const lastPlayed =
    totalGames > 0
      ? `${formatLastPlayed(
          Date.now() - Math.max(...gameResults.map((game) => Date.parse(game.endTime)))
        )} ago`
      : 'n/a';

  return {
    totalGames,
    totalReverses,
    totalUnoDeclarations,
    averageReversesPerGame,
    averageUnoDeclarationsPerGame,
    highestReversesInGame: Math.max(...gameResults.map((game) => game.reverseCount), 0),
    highestUnoDeclarationsInGame: Math.max(
      ...gameResults.map((game) => Object.values(game.unoDeclarations || {}).reduce((a, b) => a + b, 0)),
      0
    ),
    lastPlayed,
    shortestGame,
    longestGame,
    averageGameDuration,
  };
}

// Helper functions
export const getPreviousPlayers = (gameResults: GameResult[]) => {
  return Array.from(new Set(gameResults.flatMap((result) => result.players))).sort();
};
