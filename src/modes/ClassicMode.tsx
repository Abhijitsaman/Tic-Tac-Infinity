import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Grid3x3 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import AnimatedBackground from '../components/AnimatedBackground';

const ClassicMode: React.FC = () => {
  const navigate = useNavigate();
  const [boardSize, setBoardSize] = useState<3 | 4 | 5 | 6>(3);
  
  const sizes = [
    { size: 3, label: '3x3', cells: 9 },
    { size: 4, label: '4x4', cells: 16 },
    { size: 5, label: '5x5', cells: 25 },
    { size: 6, label: '6x6', cells: 36 },
  ];
  
  const startGame = () => {
    navigate(`/game/classic?size=${boardSize}`);
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
            <span className="gradient-text">Classic Mode</span>
          </h1>
          <p className="text-gray-400 text-lg">Choose your battlefield</p>
        </motion.div>
        
        <GlassCard className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Board Size</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sizes.map((size) => (
              <motion.button
                key={size.size}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBoardSize(size.size as 3 | 4 | 5 | 6)}
                className={`p-6 rounded-lg transition-all duration-300 ${
                  boardSize === size.size
                    ? 'bg-primary text-white shadow-lg shadow-primary/50'
                    : 'glass-card hover:bg-primary/20'
                }`}
              >
                <Grid3x3 className="w-12 h-12 mx-auto mb-3" />
                <div className="text-2xl font-bold">{size.label}</div>
                <div className="text-sm text-gray-400">{size.cells} cells</div>
              </motion.button>
            ))}
          </div>
        </GlassCard>
        
        <div className="flex justify-center">
          <NeonButton size="lg" onClick={startGame}>
            Start Game
          </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default ClassicMode;
