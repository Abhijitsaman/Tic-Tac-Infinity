import { useState, useCallback } from 'react';
import { BoardSize, Player, Move } from '../types';
import { createEmptyBoard, checkWinner, getAvailableMoves, makeMove } from '../utils/gameLogic';
import { getBestMove } from '../utils/minimax';

export const useGameLogic = (size: BoardSize) => {
  const [board, setBoard] = useState<(string | null)[][]>(() => createEmptyBoard(size));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[][] | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard(size));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setGameOver(false);
    setMoveHistory([]);
  }, [size]);

  const handleMove = useCallback((row: number, col: number): boolean => {
    if (gameOver || board[row][col] || winner) return false;

    const newBoard = makeMove(board, row, col, currentPlayer);
    setBoard(newBoard);

    const result = checkWinner(newBoard, size);
    
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }

    setMoveHistory([...moveHistory, { row, col, player: currentPlayer, timestamp: Date.now() }]);
    return true;
  }, [board, currentPlayer, gameOver, winner, moveHistory, size]);

  const getAIMove = useCallback((aiPlayer: Player, humanPlayer: Player): { row: number; col: number } | null => {
    if (gameOver) return null;
    return getBestMove(board, aiPlayer, humanPlayer, size);
  }, [board, gameOver, size]);

  return {
    board,
    currentPlayer,
    winner,
    winningLine,
    gameOver,
    moveHistory,
    handleMove,
    resetGame,
    getAIMove,
    setCurrentPlayer,
    setBoard,
    setWinner,
    setWinningLine,
    setGameOver,
    setMoveHistory,
  };
};
