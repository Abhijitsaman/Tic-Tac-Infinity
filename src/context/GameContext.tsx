import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  longestWinStreak: number;
  totalXP: number;
  level: number;
  rank: string;
  aiWins: number;
  humanWins: number;
  averageMatchTime: number;
  totalTimePlayed: number;
}

interface Match {
  id: string;
  date: string;
  time: string;
  winner: string;
  mode: string;
  boardSize: number;
  duration: number;
  moves: any[];
  player1Symbol: string;
  player2Symbol: string;
}

interface GameContextType {
  stats: GameStats;
  matches: Match[];
  addMatch: (match: Match) => void;
  updateStats: (stats: Partial<GameStats>) => void;
  addXP: (amount: number) => void;
  resetProgress: () => void;
  resetStats: () => void;
  resetAchievements: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const ranks = [
  { name: 'Bronze', minXP: 0 },
  { name: 'Silver', minXP: 1000 },
  { name: 'Gold', minXP: 2500 },
  { name: 'Platinum', minXP: 5000 },
  { name: 'Diamond', minXP: 10000 },
  { name: 'Master', minXP: 20000 },
  { name: 'Legend', minXP: 50000 },
];

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('gameStats');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.rank = getRankFromXP(parsed.totalXP || 0);
      return parsed;
    }
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winStreak: 0,
      longestWinStreak: 0,
      totalXP: 0,
      level: 1,
      rank: 'Bronze',
      aiWins: 0,
      humanWins: 0,
      averageMatchTime: 0,
      totalTimePlayed: 0,
    };
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('matchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  function getRankFromXP(xp: number): string {
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (xp >= ranks[i].minXP) return ranks[i].name;
    }
    return 'Bronze';
  }

  function getLevelFromXP(xp: number): number {
    return Math.floor(xp / 500) + 1;
  }

  const addXP = (amount: number) => {
    setStats(prev => {
      const newXP = prev.totalXP + amount;
      const newLevel = getLevelFromXP(newXP);
      const newRank = getRankFromXP(newXP);
      return { ...prev, totalXP: newXP, level: newLevel, rank: newRank };
    });
  };

  const updateStats = (newStats: Partial<GameStats>) => {
    setStats(prev => {
      const updated = { ...prev, ...newStats };
      updated.rank = getRankFromXP(updated.totalXP);
      updated.level = getLevelFromXP(updated.totalXP);
      return updated;
    });
  };

  const addMatch = (match: Match) => {
    setMatches(prev => [match, ...prev].slice(0, 100));
  };

  const resetProgress = () => {
    setStats({
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winStreak: 0,
      longestWinStreak: 0,
      totalXP: 0,
      level: 1,
      rank: 'Bronze',
      aiWins: 0,
      humanWins: 0,
      averageMatchTime: 0,
      totalTimePlayed: 0,
    });
    setMatches([]);
  };

  const resetStats = () => {
    setStats(prev => ({
      ...prev,
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winStreak: 0,
      longestWinStreak: 0,
      aiWins: 0,
      humanWins: 0,
      averageMatchTime: 0,
      totalTimePlayed: 0,
    }));
  };

  const resetAchievements = () => {
    // This will be handled by achievement context
    localStorage.setItem('achievements', JSON.stringify([]));
  };

  useEffect(() => {
    localStorage.setItem('gameStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('matchHistory', JSON.stringify(matches));
  }, [matches]);

  return (
    <GameContext.Provider value={{
      stats,
      matches,
      addMatch,
      updateStats,
      addXP,
      resetProgress,
      resetStats,
      resetAchievements,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
