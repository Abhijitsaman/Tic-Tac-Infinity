import { Rank } from '../types';

export const RANKS: { name: Rank; minXP: number; icon: string }[] = [
  { name: 'Bronze', minXP: 0, icon: '🥉' },
  { name: 'Silver', minXP: 1000, icon: '🥈' },
  { name: 'Gold', minXP: 2500, icon: '🥇' },
  { name: 'Platinum', minXP: 5000, icon: '💎' },
  { name: 'Diamond', minXP: 10000, icon: '💠' },
  { name: 'Master', minXP: 20000, icon: '👑' },
  { name: 'Legend', minXP: 50000, icon: '⭐' },
];

export const getRank = (xp: number): Rank => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) return RANKS[i].name;
  }
  return 'Bronze';
};

export const getLevel = (xp: number): number => {
  return Math.floor(xp / 500) + 1;
};

export const getXPForNextLevel = (level: number): number => {
  return level * 500;
};
