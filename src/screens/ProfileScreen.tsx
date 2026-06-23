import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Trophy, Award, Target, Calendar } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAchievements } from '../context/AchievementContext';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import XPBar from '../components/XPBar';
import AnimatedBackground from '../components/AnimatedBackground';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { stats } = useGame();
  const { achievements } = useAchievements();
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const winRate = stats.totalGames > 0 ? ((stats.wins / stats.totalGames) * 100).toFixed(1) : '0';
  
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8"
        >
          <NeonButton onClick={() => navigate(-1)} size="sm">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back
          </NeonButton>
        </motion.div>
        
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Player Profile</span>
          </h1>
        </motion.div>
        
        <GlassCard className="mb-8 text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-4">
              <User className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-success rounded-full p-2">
              <Trophy className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Tic Tac Master</h2>
          <p className="text-primary text-lg mb-4">{stats.rank} Rank</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-400 text-sm">Level</p>
              <p className="text-2xl font-bold">{stats.level}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total XP</p>
              <p className="text-2xl font-bold">{stats.totalXP}</p>
            </div>
          </div>
          
          <XPBar currentXP={stats.totalXP} level={stats.level} />
        </GlassCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-primary" />
              Game Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Games</span>
                <span className="font-bold">{stats.totalGames}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Wins</span>
                <span className="font-bold text-success">{stats.wins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Losses</span>
                <span className="font-bold text-danger">{stats.losses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Draws</span>
                <span className="font-bold text-warning">{stats.draws}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate</span>
                <span className="font-bold text-primary">{winRate}%</span>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-accent" />
              Achievements
            </h3>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">{unlockedCount}</div>
              <p className="text-gray-400 mb-4">of {achievements.length} unlocked</p>
              <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                  style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                />
              </div>
            </div>
          </GlassCard>
          
          <GlassCard>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-secondary" />
              Streaks
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Win Streak</span>
                <span className="font-bold text-primary">{stats.winStreak}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Longest Win Streak</span>
                <span className="font-bold text-accent">{stats.longestWinStreak}</span>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-success" />
              Additional Info
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">AI Wins</span>
                <span className="font-bold">{stats.aiWins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Human Wins</span>
                <span className="font-bold">{stats.humanWins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Match Time</span>
                <span className="font-bold">{Math.floor(stats.averageMatchTime / 60)}m {stats.averageMatchTime % 60}s</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
