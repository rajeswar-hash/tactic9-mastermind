// Game AI for Tactic9

type Board = (string | null)[];
type Difficulty = 'easy' | 'medium' | 'hard';

const SIZE = 9;
const WIN_LENGTH = 5;

const DIRECTIONS = [
  [0, 1],   // horizontal
  [1, 0],   // vertical
  [1, 1],   // diagonal down-right
  [1, -1],  // diagonal down-left
];

function idx(r: number, c: number) { return r * SIZE + c; }
function inBounds(r: number, c: number) { return r >= 0 && r < SIZE && c >= 0 && c < SIZE; }

export function checkWinner(board: Board): { winner: string; cells: number[] } | null {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = board[idx(r, c)];
      if (!cell) continue;
      for (const [dr, dc] of DIRECTIONS) {
        const cells: number[] = [];
        let count = 0;
        for (let i = 0; i < WIN_LENGTH; i++) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          if (!inBounds(nr, nc) || board[idx(nr, nc)] !== cell) break;
          cells.push(idx(nr, nc));
          count++;
        }
        if (count === WIN_LENGTH) return { winner: cell, cells };
      }
    }
  }
  return null;
}

export function isBoardFull(board: Board): boolean {
  return board.every(c => c !== null);
}

function getEmptyCells(board: Board): number[] {
  const cells: number[] = [];
  board.forEach((v, i) => { if (v === null) cells.push(i); });
  return cells;
}

// Evaluate a line segment for scoring
function evaluateSegment(board: Board, r: number, c: number, dr: number, dc: number, player: string): number {
  let own = 0, opp = 0, empty = 0;
  for (let i = 0; i < WIN_LENGTH; i++) {
    const nr = r + dr * i, nc = c + dc * i;
    if (!inBounds(nr, nc)) return 0;
    const v = board[idx(nr, nc)];
    if (v === player) own++;
    else if (v === null) empty++;
    else opp++;
  }
  if (opp > 0 && own > 0) return 0;
  if (own === 5) return 100000;
  if (opp === 5) return -100000;
  if (own === 4 && empty === 1) return 10000;
  if (opp === 4 && empty === 1) return -10000;
  if (own === 3 && empty === 2) return 1000;
  if (opp === 3 && empty === 2) return -1000;
  if (own === 2 && empty === 3) return 100;
  if (opp === 2 && empty === 3) return -100;
  if (own === 1 && empty === 4) return 10;
  return 0;
}

function evaluate(board: Board, player: string): number {
  let score = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      for (const [dr, dc] of DIRECTIONS) {
        score += evaluateSegment(board, r, c, dr, dc, player);
      }
    }
  }
  // Center bonus
  const center = Math.floor(SIZE / 2);
  for (let r = center - 1; r <= center + 1; r++) {
    for (let c = center - 1; c <= center + 1; c++) {
      if (board[idx(r, c)] === player) score += 15;
      else if (board[idx(r, c)] !== null) score -= 15;
    }
  }
  return score;
}

function getRelevantMoves(board: Board): number[] {
  const relevant = new Set<number>();
  const range = 2;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[idx(r, c)] !== null) {
        for (let dr = -range; dr <= range; dr++) {
          for (let dc = -range; dc <= range; dc++) {
            const nr = r + dr, nc = c + dc;
            if (inBounds(nr, nc) && board[idx(nr, nc)] === null) {
              relevant.add(idx(nr, nc));
            }
          }
        }
      }
    }
  }
  if (relevant.size === 0) return [idx(4, 4)];
  return Array.from(relevant);
}

function minimax(board: Board, depth: number, alpha: number, beta: number, isMax: boolean, aiPlayer: string, humanPlayer: string): number {
  const winner = checkWinner(board);
  if (winner) return winner.winner === aiPlayer ? 100000 + depth : -100000 - depth;
  if (depth === 0 || isBoardFull(board)) return evaluate(board, aiPlayer);

  const moves = getRelevantMoves(board);
  if (isMax) {
    let best = -Infinity;
    for (const move of moves) {
      board[move] = aiPlayer;
      const val = minimax(board, depth - 1, alpha, beta, false, aiPlayer, humanPlayer);
      board[move] = null;
      best = Math.max(best, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      board[move] = humanPlayer;
      const val = minimax(board, depth - 1, alpha, beta, true, aiPlayer, humanPlayer);
      board[move] = null;
      best = Math.min(best, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return best;
  }
}

export function getAIMove(board: Board, difficulty: Difficulty): number {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return -1;

  const aiPlayer = 'O';
  const humanPlayer = 'X';

  if (difficulty === 'easy') {
    // 30% chance of smart move
    if (Math.random() > 0.3) {
      return empty[Math.floor(Math.random() * empty.length)];
    }
    // Check for immediate win/block
    for (const cell of empty) {
      board[cell] = aiPlayer;
      if (checkWinner(board)) { board[cell] = null; return cell; }
      board[cell] = null;
    }
    for (const cell of empty) {
      board[cell] = humanPlayer;
      if (checkWinner(board)) { board[cell] = null; return cell; }
      board[cell] = null;
    }
    return empty[Math.floor(Math.random() * empty.length)];
  }

  if (difficulty === 'medium') {
    // Check win/block first
    for (const cell of empty) {
      board[cell] = aiPlayer;
      if (checkWinner(board)) { board[cell] = null; return cell; }
      board[cell] = null;
    }
    for (const cell of empty) {
      board[cell] = humanPlayer;
      if (checkWinner(board)) { board[cell] = null; return cell; }
      board[cell] = null;
    }
    // Simple evaluation
    const moves = getRelevantMoves(board);
    let bestMove = moves[0];
    let bestScore = -Infinity;
    for (const move of moves) {
      board[move] = aiPlayer;
      const score = evaluate(board, aiPlayer);
      board[move] = null;
      if (score > bestScore) { bestScore = score; bestMove = move; }
    }
    return bestMove;
  }

  // Hard uses minimax
  const depth = 3;
  const moves = getRelevantMoves(board);
  
  // Sort moves by heuristic for better pruning
  const scoredMoves = moves.map(move => {
    board[move] = aiPlayer;
    const score = evaluate(board, aiPlayer);
    board[move] = null;
    return { move, score };
  }).sort((a, b) => b.score - a.score).slice(0, 12);

  let bestMove = scoredMoves[0].move;
  let bestScore = -Infinity;

  for (const { move } of scoredMoves) {
    board[move] = aiPlayer;
    const score = minimax(board, depth, -Infinity, Infinity, false, aiPlayer, humanPlayer);
    board[move] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
