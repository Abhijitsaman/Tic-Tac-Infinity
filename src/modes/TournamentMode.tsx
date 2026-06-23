import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import AnimatedBackground from '../components/AnimatedBackground';

const TournamentMode: React.FC = () => {
  const navigate = useNavigate();
  const [format, setFormat] = useState<'bestOf3' | 'bestOf5' | 'bestOf7'>('bestOf3');
  
  const formats = [
    { type: 'bestOf3', label: 'Best of 3', matches: 3, icon: '🥉' },
    { type: 'bestOf5', label: 'Best of 5', matches: 5, icon: '🥈' },
    { type: 'bestOf7', label: 'Best of 7', matches: 7, icon: '🥇' },
  ];
  
  const startTournament = () => {
    navigate(`/game/tournament?format=${format}`);
  };
  
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
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Tournament Mode</span>
          </h1>
          <p className="text-gray-400 text-lg">Compete in a series of matches</p>
        </motion.div>
        
        <GlassCard className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Select Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formats.map((fmt) => (
              <motion.button
                key={fmt.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormat(fmt.type as any)}
                className={`p-6 rounded-lg transition-all duration-300 ${
                  format === fmt.type
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                    : 'glass-card hover:bg-primary/20'
                }`}
              >
                <div className="text-4xl mb-3">{fmt.icon}</div>
                <div className="text-xl font-bold">{fmt.label}</div>
                <div className="text-sm text-gray-400 mt-2">{fmt.matches} matches to win</div>
              </motion.button>
            ))}
          </div>
        </GlassCard>
        
        <div className="flex justify-center">
          <NeonButton size="lg" onClick={startTournament}>
            <Trophy className="w-5 h-5 inline mr-2" />
            Start Tournament
          </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default TournamentMode;
