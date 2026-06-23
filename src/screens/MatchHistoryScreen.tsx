import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Trophy, Eye } from 'lucide-react';
import { useGame } from '../context/GameContext';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import AnimatedBackground from '../components/AnimatedBackground';

const MatchHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { matches } = useGame();
  
  const getWinnerColor = (winner: string) => {
    if (winner === 'Draw') return 'text-warning';
    if (winner === 'Player 1') return 'text-success';
    return 'text-danger';
  };
  
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
            <span className="gradient-text">Match History</span>
          </h1>
          <p className="text-gray-400 text-lg">Your recent battles</p>
        </motion.div>
        
        {matches.length === 0 ? (
          <GlassCard className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-bold mb-2">No Matches Yet</h3>
            <p className="text-gray-400">Play your first game to see your history!</p>
            <div className="mt-6">
              <NeonButton onClick={() => navigate('/game-modes')}>
                Start Playing
              </NeonButton>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="hover:border-primary/50 transition-all duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">
                        {match.winner === 'Player 1' ? '🏆' : match.winner === 'Player 2' ? '🤖' : '🤝'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">
                          {match.mode.charAt(0).toUpperCase() + match.mode.slice(1)} Mode
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{match.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{match.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-1">Board</div>
                        <div className="font-bold">{match.boardSize}x{match.boardSize}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-1">Winner</div>
                        <div className={`font-bold ${getWinnerColor(match.winner)}`}>
                          {match.winner}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-1">Duration</div>
                        <div className="font-bold">
                          {Math.floor(match.duration / 1000 / 60)}m {Math.floor((match.duration / 1000) % 60)}s
                        </div>
                      </div>
                      
                      <NeonButton
                        onClick={() => navigate(`/replay/${match.id}`)}
                        size="sm"
                        variant="secondary"
                      >
                        <Eye className="w-4 h-4" />
                      </NeonButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchHistoryScreen;
