import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import { useGame } from '../context/GameContext';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import AnimatedBackground from '../components/AnimatedBackground';

const ReplayViewerScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { matches } = useGame();
  const [currentMove, setCurrentMove] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [board, setBoard] = useState<(string | null)[][]>([]);
  
  const match = matches.find(m => m.id === id);
  
  const initializeBoard = useCallback(() => {
    if (!match) return [];
    const newBoard = [];
    for (let i = 0; i < match.boardSize; i++) {
      newBoard.push(Array(match.boardSize).fill(null));
    }
    return newBoard;
  }, [match]);
  
  useEffect(() => {
    if (match) {
      setBoard(initializeBoard());
      setCurrentMove(0);
    }
  }, [match, initializeBoard]);
  
  useEffect(() => {
    if (!match) return;
    
    const newBoard = initializeBoard();
    for (let i = 0; i < currentMove && i < match.moves.length; i++) {
      const move = match.moves[i];
      newBoard[move.row][move.col] = move.player;
    }
    setBoard(newBoard);
  }, [currentMove, match, initializeBoard]);
  
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentMove(prev => {
        if (prev >= match?.moves.length || 0) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [isPlaying, match]);
  
  if (!match) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AnimatedBackground />
        <GlassCard className="text-center">
          <h2 className="text-2xl font-bold mb-4">Replay Not Found</h2>
          <NeonButton onClick={() => navigate('/history')}>
            Back to History
          </NeonButton>
        </GlassCard>
      </div>
    );
  }
  
  const symbolMap = {
    X: match.player1Symbol,
    O: match.player2Symbol,
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
            <span className="gradient-text">Replay Viewer</span>
          </h1>
          <p className="text-gray-400">
            {match.mode} Mode • {match.boardSize}x{match.boardSize} • {match.date}
          </p>
        </motion.div>
        
        <div className="flex justify-center mb-8">
          <div
            className="grid gap-2 bg-background-secondary/50 p-4 rounded-2xl"
            style={{
              gridTemplateColumns: `repeat(${match.boardSize}, minmax(60px, 90px))`,
            }}
          >
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl md:text-4xl font-bold"
                >
                  {cell && symbolMap[cell as keyof typeof symbolMap]}
                </div>
              ))
            )}
          </div>
        </div>
        
        <GlassCard>
          <div className="flex justify-center gap-4 flex-wrap">
            <NeonButton
              onClick={() => {
                setCurrentMove(0);
                setIsPlaying(false);
              }}
              size="sm"
              variant="secondary"
            >
              <RotateCcw className="w-4 h-4" />
            </NeonButton>
            
            <NeonButton
              onClick={() => {
                setCurrentMove(prev => Math.max(0, prev - 1));
                setIsPlaying(false);
              }}
              size="sm"
              variant="secondary"
            >
              <SkipBack className="w-4 h-4" />
            </NeonButton>
            
            <NeonButton
              onClick={() => setIsPlaying(!isPlaying)}
              size="sm"
              variant="primary"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </NeonButton>
            
            <NeonButton
              onClick={() => {
                setCurrentMove(prev => Math.min(match.moves.length, prev + 1));
                setIsPlaying(false);
              }}
              size="sm"
              variant="secondary"
            >
              <SkipForward className="w-4 h-4" />
            </NeonButton>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-400">
              Move {currentMove} of {match.moves.length}
            </div>
            <div className="h-2 bg-background-tertiary rounded-full mt-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                animate={{ width: `${(currentMove / match.moves.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </GlassCard>
        
        <div className="mt-4 text-center text-gray-400">
          <p>Winner: <span className="font-bold text-primary">{match.winner}</span></p>
          <p className="text-sm mt-2">Duration: {Math.floor(match.duration / 1000 / 60)}m {Math.floor((match.duration / 1000) % 60)}s</p>
        </div>
      </div>
    </div>
  );
};

export default ReplayViewerScreen;
