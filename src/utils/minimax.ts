import { Player, BoardSize } from '../types';
import { checkWinner, getAvailableMoves, makeMove } from './gameLogic';

export const minimax = (
  board: (string | null)[][],
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  size: BoardSize
): number => {
  const { winner } = checkWinner(board, size);
  
  if (winner === aiPlayer) return 10 - depth;
  if (winner === humanPlayer) return depth - 10;
  if (winner === 'draw') return 0;
  
  const moves = getAvailableMoves(board);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = makeMove(board, move.row, move.col, aiPlayer);
      const evalScore = minimax(newBoard, depth + 1, false, aiPlayer, humanPlayer, size);
      maxEval = Math.max(maxEval, evalScore);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newBoard = makeMove(board, move.row, move.col, humanPlayer);
      const evalScore = minimax(newBoard, depth + 1, true, aiPlayer, humanPlayer, size);
      minEval = Math.min(minEval, evalScore);
    }
    return minEval;
  }
};

export const getBestMove = (
  board: (string | null)[][],
  aiPlayer: Player,
  humanPlayer: Player,
  size: BoardSize
): { row: number; col: number } | null => {
  const moves = getAvailableMoves(board);
  let bestMove = null;
  let bestScore = -Infinity;
  
  for (const move of moves) {
    const newBoard = makeMove(board, move.row, move.col, aiPlayer);
    const score = minimax(newBoard, 0, false, aiPlayer, humanPlayer, size);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
};
