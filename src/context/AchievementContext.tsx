import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  required: number;
  progress: number;
  unlocked: boolean;
  xpReward: number;
}

interface AchievementContextType {
  achievements: Achievement[];
  checkAchievements: (type: string, value?: any) => void;
  unlockAchievement: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

const initialAchievements: Achievement[] = [
  { id: 'first_win', name: 'First Victory', description: 'Win your first match', icon: '🏆', required: 1, progress: 0, unlocked: false, xpReward: 50 },
  { id: '10_wins', name: 'Rising Star', description: 'Win 10 matches', icon: '⭐', required: 10, progress: 0, unlocked: false, xpReward: 100 },
  { id: '50_wins', name: 'Veteran Player', description: 'Win 50 matches', icon: '🎖️', required: 50, progress: 0, unlocked: false, xpReward: 250 },
  { id: '100_wins', name: 'Legendary Champion', description: 'Win 100 matches', icon: '👑', required: 100, progress: 0, unlocked: false, xpReward: 500 },
  { id: 'beat_hard_ai', name: 'AI Slayer', description: 'Beat Hard difficulty AI', icon: '🤖', required: 1, progress: 0, unlocked: false, xpReward: 150 },
  { id: 'beat_impossible_ai', name: 'Impossible is Nothing', description: 'Beat Impossible difficulty AI', icon: '🔥', required: 1, progress: 0, unlocked: false, xpReward: 500 },
  { id: 'tournament_winner', name: 'Tournament Master', description: 'Win a tournament', icon: '🏆', required: 1, progress: 0, unlocked: false, xpReward: 200 },
  { id: 'time_attack_master', name: 'Speed Demon', description: 'Win a Time Attack match', icon: '⚡', required: 1, progress: 0, unlocked: false, xpReward: 150 },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Win 10 matches in a row', icon: '💎', required: 10, progress: 0, unlocked: false, xpReward: 300 },
];

export const AchievementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      return JSON.parse(saved);
    }
    return initialAchievements;
  });

  const [unlockQueue, setUnlockQueue] = useState<string[]>([]);

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === id);
      if (achievement && !achievement.unlocked) {
        setUnlockQueue(queue => [...queue, id]);
        return prev.map(a => a.id === id ? { ...a, unlocked: true, progress: a.required } : a);
      }
      return prev;
    });
  };

  const updateProgress = (id: string, progress: number) => {
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === id);
      if (achievement && !achievement.unlocked && progress >= achievement.required) {
        setUnlockQueue(queue => [...queue, id]);
        return prev.map(a => a.id === id ? { ...a, unlocked: true, progress: a.required } : a);
      }
      return prev.map(a => a.id === id ? { ...a, progress: Math.min(progress, a.required) } : a);
    });
  };

  const checkAchievements = (type: string, value?: any) => {
    switch(type) {
      case 'win':
        const wins = value;
        updateProgress('first_win', 1);
        updateProgress('10_wins', wins);
        updateProgress('50_wins', wins);
        updateProgress('100_wins', wins);
        break;
      case 'winStreak':
        updateProgress('perfectionist', value);
        break;
      case 'beatAI':
        if (value === 'Hard') unlockAchievement('beat_hard_ai');
        if (value === 'Impossible') unlockAchievement('beat_impossible_ai');
        break;
      case 'tournamentWin':
        unlockAchievement('tournament_winner');
        break;
      case 'timeAttackWin':
        unlockAchievement('time_attack_master');
        break;
    }
  };

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  return (
    <AchievementContext.Provider value={{
      achievements,
      checkAchievements,
      unlockAchievement,
      updateProgress,
    }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) throw new Error('useAchievements must be used within AchievementProvider');
  return context;
};
