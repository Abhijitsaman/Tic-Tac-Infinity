import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Zap, Shield, Crown } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import AnimatedBackground from '../components/AnimatedBackground';

const AIMode: React.FC = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Impossible'>('Medium');
  const [boardSize, setBoardSize] = useState<3 | 4 | 5 | 6>(3);
  
  const difficulties = [
    { level: 'Easy', icon: Brain, color: 'success', description: 'Random moves' },
    { level: 'Medium', icon: Zap, color: 'secondary', description: 'Basic strategy' },
    { level: 'Hard', icon: Shield, color: 'warning', description: 'Strong AI' },
    { level: 'Impossible', icon: Crown, color: 'accent', description: 'Minimax algorithm' },
  ];
  
  const aiNames = {
    Easy: 'Nova',
    Medium: 'Titan',
    Hard: 'Phantom',
    Impossible: 'Omega',
  };
  
  const sizes = [3, 4, 5, 6];
  
  const startGame = () => {
    navigate(`/game/ai?difficulty=${difficulty}&size=${boardSize}&aiName=${aiNames[difficulty]}`);
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
            <span className="gradient-text">VS AI</span>
          </h1>
          <p className="text-gray-400 text-lg">Test your skills against artificial intelligence</p>
        </motion.div>
        
        <GlassCard className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Select Difficulty</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {difficulties.map((diff) => (
              <motion.button
                key={diff.level}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDifficulty(diff.level as any)}
                className={`p-6 rounded-lg transition-all duration-300 ${
                  difficulty === diff.level
                    ? `bg-${diff.color} text-white shadow-lg shadow-${diff.color}/50`
                    : 'glass-card hover:bg-primary/20'
                }`}
              >
                <diff.icon className={`w-12 h-12 mx-auto mb-3 text-${diff.color}`} />
                <div className="text-xl font-bold">{diff.level}</div>
                <div className="text-sm text-gray-400 mt-2">{diff.description}</div>
              </motion.button>
            ))}
          </div>
        </GlassCard>
        
        <GlassCard className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Board Size</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {sizes.map((size) => (
              <motion.button
                key={size}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBoardSize(size as 3 | 4 | 5 | 6)}
                className={`w-20 h-20 rounded-lg transition-all duration-300 ${
                  boardSize === size
                    ? 'bg-primary text-white shadow-lg shadow-primary/50'
                    : 'glass-card hover:bg-primary/20'
                }`}
              >
                <div className="text-2xl font-bold">{size}x{size}</div>
              </motion.button>
            ))}
          </div>
        </GlassCard>
        
        <div className="flex justify-center">
          <NeonButton size="lg" onClick={startGame}>
            Battle AI
          </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default AIMode;
