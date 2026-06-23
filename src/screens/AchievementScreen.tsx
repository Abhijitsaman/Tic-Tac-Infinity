import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Lock, CheckCircle } from 'lucide-react';
import { useAchievements } from '../context/AchievementContext';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import AnimatedBackground from '../components/AnimatedBackground';

const AchievementScreen: React.FC = () => {
  const navigate = useNavigate();
  const { achievements } = useAchievements();
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);
  
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <span className="gradient-text">Achievements</span>
          </h1>
          <p className="text-gray-400 text-lg">Track your progress and earn rewards</p>
        </motion.div>
        
        <GlassCard className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Unlocked</p>
              <p className="text-3xl font-bold text-primary">{unlockedCount}/{achievements.length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Completion</p>
              <p className="text-3xl font-bold text-secondary">
                {((unlockedCount / achievements.length) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Total XP Earned</p>
              <p className="text-3xl font-bold text-accent">{totalXP}</p>
            </div>
          </div>
          
          <div className="mt-4 h-2 bg-background-tertiary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </GlassCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard
                className={`relative overflow-hidden transition-all duration-300 ${
                  achievement.unlocked ? 'border-success/50' : 'opacity-75'
                }`}
              >
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                )}
                
                <div className="text-center mb-3">
                  <div className={`text-5xl mb-2 ${achievement.unlocked ? 'animate-bounce' : ''}`}>
                    {achievement.icon}
                  </div>
                  <h3 className="text-lg font-bold">{achievement.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className={achievement.unlocked ? 'text-success' : 'text-primary'}>
                      {achievement.progress}/{achievement.required}
                    </span>
                  </div>
                  <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full transition-all duration-500 ${
                        achievement.unlocked ? 'bg-success' : 'bg-primary'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(achievement.progress / achievement.required) * 100}%` }}
                    />
                  </div>
                </div>
                
                {!achievement.unlocked && (
                  <div className="mt-3 text-center">
                    <div className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </div>
                  </div>
                )}
                
                {achievement.unlocked && (
                  <div className="mt-3 text-center">
                    <div className="text-xs text-success">+{achievement.xpReward} XP</div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementScreen;
