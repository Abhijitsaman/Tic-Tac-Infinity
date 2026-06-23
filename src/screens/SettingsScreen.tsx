import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Music, Palette, RotateCcw, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { useGame } from '../context/GameContext';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import AnimatedBackground from '../components/AnimatedBackground';

const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { musicEnabled, soundEffectsEnabled, volume, toggleMusic, toggleSoundEffects, setVolume } = useAudio();
  const { resetProgress, resetStats, resetAchievements } = useGame();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const themes = [
    { id: 'cosmic', name: 'Cosmic', color: 'from-purple-600 to-cyan-500' },
    { id: 'neon-purple', name: 'Neon Purple', color: 'from-purple-800 to-pink-600' },
    { id: 'lava-red', name: 'Lava Red', color: 'from-red-700 to-orange-600' },
    { id: 'ocean-blue', name: 'Ocean Blue', color: 'from-blue-800 to-cyan-600' },
    { id: 'emerald-green', name: 'Emerald Green', color: 'from-green-800 to-emerald-600' },
  ];
  
  const handleResetAll = () => {
    resetProgress();
    resetStats();
    resetAchievements();
    setShowResetConfirm(false);
    alert('All data has been reset successfully!');
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
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-gray-400 text-lg">Customize your experience</p>
        </motion.div>
        
        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <Music className="w-6 h-6 mr-2 text-primary" />
              Audio Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Background Music</span>
                <NeonButton onClick={toggleMusic} size="sm" variant={musicEnabled ? 'primary' : 'secondary'}>
                  {musicEnabled ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  {musicEnabled ? ' ON' : ' OFF'}
                </NeonButton>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Sound Effects</span>
                <NeonButton onClick={toggleSoundEffects} size="sm" variant={soundEffectsEnabled ? 'primary' : 'secondary'}>
                  {soundEffectsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  {soundEffectsEnabled ? ' ON' : ' OFF'}
                </NeonButton>
              </div>
              
              <div>
                <span className="block mb-2">Volume: {Math.round(volume * 100)}%</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </GlassCard>
          
          <GlassCard>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <Palette className="w-6 h-6 mr-2 text-accent" />
              Appearance
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`p-4 rounded-lg transition-all duration-300 ${
                    theme === t.id
                      ? `bg-gradient-to-r ${t.color} shadow-lg scale-105`
                      : 'glass-card hover:scale-105'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-semibold">{t.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
          
          <GlassCard>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <RotateCcw className="w-6 h-6 mr-2 text-warning" />
              Data Management
            </h3>
            
            <div className="space-y-3">
              <NeonButton onClick={() => setShowResetConfirm(true)} variant="danger" className="w-full">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Reset All Data
              </NeonButton>
            </div>
          </GlassCard>
        </div>
        
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowResetConfirm(false)}
          >
            <GlassCard className="max-w-md mx-4 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold mb-4">Reset All Data?</h3>
              <p className="text-gray-400 mb-6">
                This action cannot be undone. All your progress, achievements, and statistics will be permanently deleted.
              </p>
              <div className="flex gap-4">
                <NeonButton onClick={() => setShowResetConfirm(false)} variant="secondary" className="flex-1">
                  Cancel
                </NeonButton>
                <NeonButton onClick={handleResetAll} variant="danger" className="flex-1">
                  Reset
                </NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SettingsScreen;
