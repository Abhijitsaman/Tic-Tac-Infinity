import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
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

export const checkAchievementProgress = (
  achievements: Achievement[],
  type: string,
  value: number
): Achievement[] => {
  return achievements.map(ach => {
    if (ach.unlocked) return ach;
    
    let progress = ach.progress;
    switch (type) {
      case 'win':
        if (ach.id === 'first_win' || ach.id === '10_wins' || ach.id === '50_wins' || ach.id === '100_wins') {
          progress = Math.min(value, ach.required);
        }
        break;
      case 'winStreak':
        if (ach.id === 'perfectionist') {
          progress = Math.min(value, ach.required);
        }
        break;
      default:
        break;
    }
    
    return { ...ach, progress };
  });
};
