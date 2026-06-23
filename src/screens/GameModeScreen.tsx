import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Bot, Trophy, Timer, ArrowLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import AnimatedBackground from '../components/AnimatedBackground';

const GameModeScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const modes = [
    {
      icon: Users,
      title: 'Classic Mode',
      description: 'Player vs Player on various board sizes',
      color: 'primary',
      path: '/classic',
    },
    {
      icon: Bot,
      title: 'AI Mode',
      description: 'Challenge AI with different difficulties',
      color: 'secondary',
      path: '/ai',
    },
    {
      icon: Trophy,
      title: 'Tournament Mode',
      description: 'Compete in best of series matches',
      color: 'accent',
      path: '/tournament',
    },
    {
      icon: Timer,
      title: 'Time Attack',
      description: 'Race against the clock',
      color: 'success',
      path: '/time-attack',
    },
  ];
  
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Select Game Mode</span>
          </h1>
          <p className="text-gray-400 text-lg">Choose how you want to play</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modes.map((mode, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                onClick={() => navigate(mode.path)}
                className="cursor-pointer group hover:border-primary/50"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-${mode.color}/20`}>
                    <mode.icon className={`w-8 h-8 text-${mode.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{mode.title}</h3>
                    <p className="text-gray-400">{mode.description}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameModeScreen;
