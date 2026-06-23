import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Timer } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import AnimatedBackground from '../components/AnimatedBackground';

const TimeAttackMode: React.FC = () => {
  const navigate = useNavigate();
  const [timeLimit, setTimeLimit] = useState<10 | 15 | 30>(15);
  const [boardSize, setBoardSize] = useState<3 | 4>(3);
  
  const timeLimits = [
    { limit: 10, label: '10 Seconds', color: 'danger' },
    { limit: 15, label: '15 Seconds', color: 'warning' },
    { limit: 30, label: '30 Seconds', color: 'success' },
  ];
  
  const startGame = () => {
    navigate(`/game/timeattack?time=${timeLimit}&size=${boardSize}`);
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
            <span className="gradient-text">Time Attack</span>
          </h1>
          <p className="text-gray-400 text-lg">Race against the clock</p>
        </motion.div>
        
        <GlassCard className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Time Limit</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {timeLimits.map((time) => (
              <motion.button
                key={time.limit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeLimit(time.limit as 10 | 15 | 30)}
                className={`p-6 rounded-lg transition-all duration-300 ${
                  timeLimit === time.limit
                    ? `bg-${time.color} text-white shadow-lg`
                    : 'glass-card hover:bg-primary/20'
                }`}
              >
                <Timer className="w-12 h-12 mx-auto mb-3" />
                <div className="text-2xl font-bold">{time.label}</div>
              </motion.button>
            ))}
          </div>
        </GlassCard>
        
        <GlassCard className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Board Size</h3>
          <div className="flex justify-center gap-4">
            {[3, 4].map((size) => (
              <motion.button
                key={size}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBoardSize(size as 3 | 4)}
                className={`w-32 h-32 rounded-lg transition-all duration-300 ${
                  boardSize === size
                    ? 'bg-primary text-white shadow-lg shadow-primary/50'
                    : 'glass-card hover:bg-primary/20'
                }`}
              >
                <div className="text-3xl font-bold">{size}x{size}</div>
                <div className="text-sm text-gray-400 mt-2">{size === 3 ? 'Classic' : 'Hard'}</div>
              </motion.button>
            ))}
          </div>
        </GlassCard>
        
        <div className="flex justify-center">
          <NeonButton size="lg" onClick={startGame}>
            Start Challenge
          </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default TimeAttackMode;
