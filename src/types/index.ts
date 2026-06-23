export type Player = 'X' | 'O';
export type GameMode = 'classic' | 'ai' | 'tournament' | 'timeattack';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Impossible';
export type BoardSize = 3 | 4 | 5 | 6;
export type SymbolPack = 'xoxo' | 'starHeart' | 'fireIce' | 'catDog';
export type Rank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Legend';
export type Theme = 'cosmic' | 'neon-purple' | 'lava-red' | 'ocean-blue' | 'emerald-green';

export interface Move {
  row: number;
  col: number;
  player: Player;
  timestamp: number;
}

export interface Match {
  id: string;
  date: string;
  time: string;
  winner: string;
  mode: GameMode | string;
  boardSize: number;
  duration: number;
  moves: Move[];
  player1Symbol: string;
  player2Symbol: string;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  longestWinStreak: number;
  totalXP: number;
  level: number;
  rank: Rank;
  aiWins: number;
  humanWins: number;
  averageMatchTime: number;
  totalTimePlayed: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  required: number;
  progress: number;
  unlocked: boolean;
  xpReward: number;
}
