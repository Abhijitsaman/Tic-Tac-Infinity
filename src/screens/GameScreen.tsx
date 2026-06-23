import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Undo, Play, Pause, Lightbulb, Volume2 } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { useGame } from '../context/GameContext';
import { useAchievements } from '../context/AchievementContext';
import { useAudio } from '../context/AudioContext';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import AnimatedBackground from '../components/AnimatedBackground';
import { SYMBOL_PACKS } from '../utils/constants';

interface Move {
  row: number;
  col: number;
  player: string;
  timestamp: number;
}

const GameScreen: React.FC = () => {
  const { mode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { stats, addMatch, updateStats, addXP } = useGame();
  const { checkAchievements } = useAchievements();
  const { playSound } = useAudio();
  
  const queryParams = new URLSearchParams(location.search);
  const boardSize = parseInt(queryParams.get('size') || '3');
  const difficulty = queryParams.get('difficulty');
  const aiName = queryParams.get('aiName');
  const timeLimit = queryParams.get('time');
  const tournamentFormat = queryParams.get('format');
  
  const [board, setBoard] = useState<(string | null)[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[][] | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit ? parseInt(timeLimit) : null);
  const [tournamentScore, setTournamentScore] = useState({ player: 0, opponent: 0 });
  const [tournamentRound, setTournamentRound] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [symbolPack, setSymbolPack] = useState<'xoxo' | 'starHeart' | 'fireIce' | 'catDog'>('xoxo');
  
  const symbolMaps = SYMBOL_PACKS;
  
  const initializeBoard = useCallback(() => {
    const newBoard = [];
    for (let i = 0; i < boardSize; i++) {
      newBoard.push(Array(boardSize).fill(null));
    }
    return newBoard;
  }, [boardSize]);
  
  useEffect(() => {
    setBoard(initializeBoard());
    setCurrentPlayer('X');
    setWinner(null);
    setGameOver(false);
    setMoveHistory([]);
    setWinningLine(null);
    if (timeLimit) setTimeLeft(parseInt(timeLimit));
  }, [boardSize, mode, initializeBoard, timeLimit]);
  
  const checkWinner = useCallback((boardState: (string | null)[][]) => {
    const lines = [];
    
    for (let i = 0; i < boardSize; i++) {
      const row = [];
      for (let j = 0; j < boardSize; j++) row.push([i, j]);
      lines.push(row);
      
      const col = [];
      for (let j = 0; j < boardSize; j++) col.push([j, i]);
      lines.push(col);
    }
    
    const diag1 = [];
    for (let i = 0; i < boardSize; i++) diag1.push([i, i]);
    lines.push(diag1);
    
    const diag2 = [];
    for (let i = 0; i < boardSize; i++) diag2.push([i, boardSize - 1 - i]);
    lines.push(diag2);
    
    for (const line of lines) {
      const firstCell = boardState[line[0][0]][line[0][1]];
      if (firstCell && line.every(([row, col]) => boardState[row][col] === firstCell)) {
        return { winner: firstCell, line };
      }
    }
    
    if (boardState.every(row => row.every(cell => cell !== null))) {
      return { winner: 'draw', line: null };
    }
    
    return { winner: null, line: null };
  }, [boardSize]);
  
  const makeMove = useCallback((row: number, col: number) => {
    if (gameOver || board[row][col] || winner || isPaused) return false;
    
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    
    const { winner: gameWinner, line } = checkWinner(newBoard);
    
    if (gameWinner) {
      if (gameWinner === 'draw') {
        setGameOver(true);
        playSound('draw');
        updateStats({ draws: stats.draws + 1 });
        addXP(10);
      } else {
        setWinner(gameWinner);
        setGameOver(true);
        setWinningLine(line);
        playSound('win');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        
        const isPlayerWin = (mode === 'ai' && gameWinner === 'X') || 
                           (mode === 'classic' && gameWinner === currentPlayer);
        
        if (isPlayerWin) {
          addXP(20);
          updateStats({ 
            wins: stats.wins + 1, 
            winStreak: stats.winStreak + 1,
            longestWinStreak: Math.max(stats.longestWinStreak, stats.winStreak + 1)
          });
          checkAchievements('win', stats.wins + 1);
          checkAchievements('winStreak', stats.winStreak + 1);
          
          if (difficulty) checkAchievements('beatAI', difficulty);
        } else {
          updateStats({ losses: stats.losses + 1, winStreak: 0 });
        }
      }
      
      const match = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        winner: gameWinner === 'draw' ? 'Draw' : gameWinner === 'X' ? 'Player 1' : 'Player 2',
        mode: mode || 'unknown',
        boardSize,
        duration: Date.now() - (moveHistory[0]?.timestamp || Date.now()),
        moves: moveHistory,
        player1Symbol: symbolMaps[symbolPack].X,
        player2Symbol: symbolMaps[symbolPack].O,
      };
      addMatch(match);
      
      if (tournamentFormat) {
        const newScore = { ...tournamentScore };
        if (gameWinner === 'X') newScore.player++;
        else if (gameWinner === 'O') newScore.opponent++;
        setTournamentScore(newScore);
        
        const winsNeeded = tournamentFormat === 'bestOf3' ? 2 : tournamentFormat === 'bestOf5' ? 3 : 4;
        if (newScore.player >= winsNeeded || newScore.opponent >= winsNeeded) {
          if (newScore.player > newScore.opponent) {
            checkAchievements('tournamentWin');
            addXP(50);
          }
          // Tournament over - don't reset
        } else {
          // Reset for next round
          setTournamentRound(tournamentRound + 1);
          setBoard(initializeBoard());
          setCurrentPlayer('X');
          setMoveHistory([]);
          return true;
        }
      }
      
      return true;
    }
    
    setMoveHistory([...moveHistory, { row, col, player: currentPlayer, timestamp: Date.now() }]);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    playSound('click');
    
    return true;
  }, [board, currentPlayer, gameOver, winner, isPaused, checkWinner, playSound, addXP, updateStats, stats, moveHistory, mode, boardSize, difficulty, tournamentFormat, tournamentScore, tournamentRound, initializeBoard, symbolPack]);
  
  const getAIMove = useCallback(() => {
    if (currentPlayer !== 'O' || gameOver || winner || isPaused) return;
    
    setTimeout(() => {
      let bestMove = null;
      
      if (difficulty === 'Easy') {
        const emptyCells = [];
        for (let i = 0; i < boardSize; i++) {
          for (let j = 0; j < boardSize; j++) {
            if (!board[i][j]) emptyCells.push([i, j]);
          }
        }
        if (emptyCells.length > 0) {
          const random = Math.floor(Math.random() * emptyCells.length);
          bestMove = emptyCells[random];
        }
      } else if (difficulty === 'Medium') {
        for (let i = 0; i < boardSize; i++) {
          for (let j = 0; j < boardSize; j++) {
            if (!board[i][j]) {
              const testBoard = board.map(r => [...r]);
              testBoard[i][j] = 'O';
              const { winner: winCheck } = checkWinner(testBoard);
              if (winCheck === 'O') {
                bestMove = [i, j];
                break;
              }
              
              const testBoardX = board.map(r => [...r]);
              testBoardX[i][j] = 'X';
              const { winner: blockCheck } = checkWinner(testBoardX);
              if (blockCheck === 'X') {
                bestMove = [i, j];
                break;
              }
            }
          }
          if (bestMove) break;
        }
        
        if (!bestMove) {
          for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
              if (!board[i][j]) {
                bestMove = [i, j];
                break;
              }
            }
            if (bestMove) break;
          }
        }
      } else {
        const minimax = (boardState: (string | null)[][], depth: number, isMaximizing: boolean): number => {
          const { winner: gameWinner } = checkWinner(boardState);
          if (gameWinner === 'O') return 10 - depth;
          if (gameWinner === 'X') return depth - 10;
          if (gameWinner === 'draw') return 0;
          
          if (isMaximizing) {
            let best = -Infinity;
            for (let i = 0; i < boardSize; i++) {
              for (let j = 0; j < boardSize; j++) {
                if (!boardState[i][j]) {
                  boardState[i][j] = 'O';
                  const score = minimax(boardState, depth + 1, false);
                  boardState[i][j] = null;
                  best = Math.max(score, best);
                }
              }
            }
            return best;
          } else {
            let best = Infinity;
            for (let i = 0; i < boardSize; i++) {
              for (let j = 0; j < boardSize; j++) {
                if (!boardState[i][j]) {
                  boardState[i][j] = 'X';
                  const score = minimax(boardState, depth + 1, true);
                  boardState[i][j] = null;
                  best = Math.min(score, best);
                }
              }
            }
            return best;
          }
        };
        
        let bestScore = -Infinity;
        for (let i = 0; i < boardSize; i++) {
          for (let j = 0; j < boardSize; j++) {
            if (!board[i][j]) {
              const testBoard = board.map(r => [...r]);
              testBoard[i][j] = 'O';
              const score = minimax(testBoard, 0, false);
              if (score > bestScore) {
                bestScore = score;
                bestMove = [i, j];
              }
            }
          }
        }
      }
      
      if (bestMove) makeMove(bestMove[0], bestMove[1]);
    }, 100);
  }, [currentPlayer, gameOver, winner, isPaused, board, boardSize, difficulty, checkWinner, makeMove]);
  
  useEffect(() => {
    if (mode === 'ai' && currentPlayer === 'O' && !gameOver && !winner) {
      getAIMove();
    }
  }, [currentPlayer, mode, gameOver, winner, getAIMove]);
  
  useEffect(() => {
    if (timeLeft && !gameOver && !winner && !isPaused && currentPlayer === 'X') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev && prev <= 1) {
            clearInterval(timer);
            const emptyCells = [];
            for (let i = 0; i < boardSize; i++) {
              for (let j = 0; j < boardSize; j++) {
                if (!board[i][j]) emptyCells.push([i, j]);
              }
            }
            if (emptyCells.length > 0) {
              const random = Math.floor(Math.random() * emptyCells.length);
              makeMove(emptyCells[random][0], emptyCells[random][1]);
            }
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, gameOver, winner, isPaused, currentPlayer, board, boardSize, makeMove]);
  
  const undoMove = () => {
    if (moveHistory.length === 0 || gameOver || winner) return;
    const lastMove = moveHistory[moveHistory.length - 1];
    const newBoard = board.map(r => [...r]);
    newBoard[lastMove.row][lastMove.col] = null;
    setBoard(newBoard);
    setMoveHistory(moveHistory.slice(0, -1));
    setCurrentPlayer(lastMove.player as 'X' | 'O');
    playSound('click');
  };
  
  const getHint = () => {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (!board[i][j]) {
          const testBoard = board.map(r => [...r]);
          testBoard[i][j] = currentPlayer;
          const { winner: winCheck } = checkWinner(testBoard);
          if (winCheck === currentPlayer) {
            alert(`Hint: Try position (${i + 1}, ${j + 1})`);
            return;
          }
        }
      }
    }
    alert('No immediate winning moves available');
  };
  
  const restartGame = () => {
    setBoard(initializeBoard());
    setCurrentPlayer('X');
    setWinner(null);
    setGameOver(false);
    setMoveHistory([]);
    setWinningLine(null);
    if (timeLimit) setTimeLeft(parseInt(timeLimit));
    playSound('click');
  };
  
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      {showConfetti && <ReactConfetti />}
      
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <NeonButton onClick={() => navigate('/game-modes')} size="sm">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Exit
          </NeonButton>
          
          <div className="flex gap-2 flex-wrap">
            <NeonButton onClick={undoMove} size="sm" variant="secondary">
              <Undo className="w-4 h-4" />
            </NeonButton>
            <NeonButton onClick={restartGame} size="sm" variant="accent">
              <RotateCcw className="w-4 h-4" />
            </NeonButton>
            <NeonButton onClick={() => setIsPaused(!isPaused)} size="sm" variant="secondary">
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </NeonButton>
            <NeonButton onClick={getHint} size="sm" variant="primary">
              <Lightbulb className="w-4 h-4" />
            </NeonButton>
          </div>
        </div>
        
        {timeLimit && (
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-primary">⏱️ Time Left: {timeLeft}s</div>
          </div>
        )}
        
        {tournamentFormat && (
          <GlassCard className="mb-4">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-sm text-gray-400">Player</div>
                <div className="text-3xl font-bold text-primary">{tournamentScore.player}</div>
              </div>
              <div className="text-2xl font-bold">VS</div>
              <div className="text-center">
                <div className="text-sm text-gray-400">{aiName || 'Opponent'}</div>
                <div className="text-3xl font-bold text-accent">{tournamentScore.opponent}</div>
              </div>
            </div>
            <div className="text-center mt-2 text-sm">Round {tournamentRound}</div>
          </GlassCard>
        )}
        
        <div className="flex justify-center mb-4">
          <GlassCard className="inline-block">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Current Turn</div>
              <div className="text-4xl">
                {currentPlayer === 'X' ? symbolMaps[symbolPack].X : symbolMaps[symbolPack].O}
              </div>
              {mode === 'ai' && currentPlayer === 'O' && (
                <div className="text-xs text-secondary mt-1">{aiName} is thinking...</div>
              )}
            </div>
          </GlassCard>
        </div>
        
        <div className="flex justify-center">
          <div
            className="grid gap-2 bg-background-secondary/50 p-4 rounded-2xl"
            style={{
              gridTemplateColumns: `repeat(${boardSize}, minmax(60px, 90px))`,
            }}
          >
            {board.map((row, i) =>
              row.map((cell, j) => (
                <motion.button
                  key={`${i}-${j}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => makeMove(i, j)}
                  disabled={!!cell || gameOver || winner || isPaused || (mode === 'ai' && currentPlayer === 'O')}
                  className={`
                    aspect-square rounded-xl font-bold text-3xl md:text-4xl
                    transition-all duration-300
                    ${cell 
                      ? 'bg-gradient-to-br from-primary/30 to-accent/30 shadow-lg' 
                      : 'glass-card hover:bg-primary/20 hover:shadow-lg'
                    }
                    ${winningLine?.some(([row, col]) => row === i && col === j) 
                      ? 'neon-border bg-primary/50 animate-pulse' 
                      : ''
                    }
                  `}
                >
                  {cell && symbolMaps[symbolPack][cell as keyof typeof symbolMaps[symbolPack]]}
                </motion.button>
              ))
            )}
          </div>
        </div>
        
        {(winner || gameOver) && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
          >
            <GlassCard className="text-center max-w-md mx-4">
              <h2 className="text-3xl font-bold mb-4">
                {winner === 'draw' 
                  ? "It's a Draw!" 
                  : winner === 'X' 
                    ? `${symbolMaps[symbolPack].X} Wins!` 
                    : `${symbolMaps[symbolPack].O} Wins!`
                }
              </h2>
              <div className="flex gap-3 justify-center">
                <NeonButton onClick={() => navigate('/game-modes')}>
                  Play Again
                </NeonButton>
                <NeonButton onClick={restartGame} variant="secondary">
                  Rematch
                </NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};
