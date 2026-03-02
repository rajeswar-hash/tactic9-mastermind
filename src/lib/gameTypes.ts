export type CellValue = 'X' | 'O' | null;
export type GameMode = 'friend' | 'bot';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';

export interface GameStats {
  totalGames: number;
  xWins: number;
  oWins: number;
  draws: number;
}

export interface GameState {
  board: CellValue[];
  currentPlayer: 'X' | 'O';
  gameOver: boolean;
  winner: string | null;
  winningCells: number[];
  moveCount: number;
  lastMove: number | null;
  history: { board: CellValue[]; player: 'X' | 'O'; lastMove: number | null }[];
}

export const BOARD_SIZE = 9;
export const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

export function createInitialState(): GameState {
  return {
    board: Array(TOTAL_CELLS).fill(null),
    currentPlayer: 'X',
    gameOver: false,
    winner: null,
    winningCells: [],
    moveCount: 0,
    lastMove: null,
    history: [],
  };
}

export function loadStats(key: string): GameStats {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { totalGames: 0, xWins: 0, oWins: 0, draws: 0 };
}

export function saveStats(key: string, stats: GameStats) {
  localStorage.setItem(key, JSON.stringify(stats));
}
