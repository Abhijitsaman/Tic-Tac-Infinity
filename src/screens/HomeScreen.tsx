import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Award, BarChart3, User, History, Settings, Play, TrendingUp, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAchievements } from '../context/AchievementContext';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import XPBar from '../components/XPBar';
import AnimatedBackground from '../components/AnimatedBackground';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { stats } = useGame();
  const { achievements } = useAchievements();
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const winRate = stats.totalGames > 0 ? ((stats.wins / stats.totalGames) * 100).toFixed(1) : '0';
  
  const quickActions = [
    { icon: Play, label: 'Play Game', color: 'primary', path: '/game-modes' },
    { icon: Trophy, label: 'Achievements', color: 'accent', path: '/achievements' },
    { icon: BarChart3, label: 'Statistics', color: 'secondary', path: '/statistics' },
    { icon: User, label: 'Profile', color: 'primary', path: '/profile' },
    { icon: History, label: 'History', color: 'secondary', path: '/history' },
    { icon: Settings, label: 'Settings', color: 'accent', path: '/settings' },
  ];
  
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-4">
            <span className="gradient-text">Tic Tac Infinity</span>
          </h1>
          <p className="text-gray-400 text-lg">Premium Gaming Experience</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Player Progress</h3>
                <p className="text-3xl font-bold text-primary">{stats.rank}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Level {stats.level}</p>
                <p className="text-2xl font-bold">{stats.totalXP} XP</p>
              </div>
            </div>
            <XPBar currentXP={stats.totalXP} level={stats.level} />
          </GlassCard>
          
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Win Rate</p>
                <p className="text-3xl font-bold text-success">{winRate}%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Achievements</p>
                <p className="text-3xl font-bold text-accent">{unlockedCount}/{achievements.length}</p>
              </div>
            </div>
          </GlassCard>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard
                onClick={() => navigate(action.path)}
                className="text-center cursor-pointer hover:bg-primary/10"
              >
                <action.icon className={`w-8 h-8 mx-auto mb-2 text-${action.color}`} />
                <p className="text-sm font-medium">{action.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready to Play?</h3>
                <p className="text-gray-300">Choose your game mode and start your journey</p>
              </div>
              <NeonButton size="lg" onClick={() => navigate('/game-modes')}>
                <Play className="w-5 h-5 inline mr-2" />
                Start Game
              </NeonButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeScreen;
