import { SymbolPack } from '../types';

export const SYMBOL_PACKS: Record<SymbolPack, { X: string; O: string }> = {
  xoxo: { X: 'X', O: 'O' },
  starHeart: { X: '⭐', O: '❤️' },
  fireIce: { X: '🔥', O: '❄️' },
  catDog: { X: '🐱', O: '🐶' },
};

export const AI_NAMES = {
  Easy: 'Nova',
  Medium: 'Titan',
  Hard: 'Phantom',
  Impossible: 'Omega',
};

export const BOARD_SIZES = [3, 4, 5, 6] as const;
export const TIME_LIMITS = [10, 15, 30] as const;
export const TOURNAMENT_FORMATS = ['bestOf3', 'bestOf5', 'bestOf7'] as const;

export const THEMES = {
  cosmic: { primary: '#8B5CF6', secondary: '#06B6D4', accent: '#EC4899' },
  'neon-purple': { primary: '#A855F7', secondary: '#D946EF', accent: '#F43F5E' },
  'lava-red': { primary: '#EF4444', secondary: '#F97316', accent: '#DC2626' },
  'ocean-blue': { primary: '#06B6D4', secondary: '#3B82F6', accent: '#0EA5E9' },
  'emerald-green': { primary: '#10B981', secondary: '#34D399', accent: '#059669' },
};

export const XP_REWARDS = {
  play: 10,
  win: 20,
  beatAI: 30,
  achievement: 50,
};
