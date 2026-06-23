import { Player, BoardSize, Move } from '../types';

export const createEmptyBoard = (size: BoardSize): (string | null)[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(null));
};

export const checkWinner = (board: (string | null)[][], size: BoardSize): { winner: string | null; line: number[][] | null } => {
  const lines: number[][][] = [];
  
  // Rows
  for (let i = 0; i < size; i++) {
    const row: number[][] = [];
    for (let j = 0; j < size; j++) row.push([i, j]);
    lines.push(row);
  }
  
  // Columns
  for (let i = 0; i < size; i++) {
    const col: number[][] = [];
    for (let j = 0; j < size; j++) col.push([j, i]);
    lines.push(col);
  }
  
  // Diagonals
  const diag1: number[][] = [];
  const diag2: number[][] = [];
  for (let i = 0; i < size; i++) {
    diag1.push([i, i]);
    diag2.push([i, size - 1 - i]);
  }
  lines.push(diag1);
  lines.push(diag2);
  
  for (const line of lines) {
    const first = board[line[0][0]][line[0][1]];
    if (first && line.every(([row, col]) => board[row][col] === first)) {
      return { winner: first, line };
    }
  }
  
  const isDraw = board.every(row => row.every(cell => cell !== null));
  if (isDraw) return { winner: 'draw', line: null };
  
  return { winner: null, line: null };
};

export const getAvailableMoves = (board: (string | null)[][]): { row: number; col: number }[] => {
  const moves: { row: number; col: number }[] = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (!board[i][j]) moves.push({ row: i, col: j });
    }
  }
  return moves;
};

export const makeMove = (
  board: (string | null)[][],
  row: number,
  col: number,
  player: Player
): (string | null)[][] => {
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = player;
  return newBoard;
};
