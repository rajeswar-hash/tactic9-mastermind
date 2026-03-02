import { useState, useCallback, useEffect, useRef } from 'react';
import NavBar from '@/components/NavBar';
import GameBoard from '@/components/GameBoard';
import StatsCard from '@/components/StatsCard';
import WinModal from '@/components/WinModal';
import HowToPlay from '@/components/HowToPlay';
import ContactPage from '@/components/ContactPage';
import {
  GameMode, Difficulty, GameState, GameStats,
  createInitialState, loadStats, saveStats,
} from '@/lib/gameTypes';
import { checkWinner, isBoardFull, getAIMove } from '@/lib/gameAI';
import { playMoveSound, playWinSound, playDrawSound, playUndoSound } from '@/lib/sounds';

export default function Index() {
  const [page, setPage] = useState('home');
  const [mode, setMode] = useState<GameMode>('bot');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [game, setGame] = useState<GameState>(createInitialState());
  const [soundOn, setSoundOn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [thinking, setThinking] = useState(false);

  const [friendStats, setFriendStats] = useState<GameStats>(() => loadStats('tactic9_friend'));
  const [botStats, setBotStats] = useState<GameStats>(() => loadStats('tactic9_bot'));

  const gameRef = useRef(game);
  gameRef.current = game;

  const currentStats = mode === 'friend' ? friendStats : botStats;
  const setCurrentStats = mode === 'friend' ? setFriendStats : setBotStats;
  const statsKey = mode === 'friend' ? 'tactic9_friend' : 'tactic9_bot';

  const updateStats = useCallback((winner: string | null) => {
    const key = mode === 'friend' ? 'tactic9_friend' : 'tactic9_bot';
    const setter = mode === 'friend' ? setFriendStats : setBotStats;
    setter(prev => {
      const next = {
        totalGames: prev.totalGames + 1,
        xWins: prev.xWins + (winner === 'X' ? 1 : 0),
        oWins: prev.oWins + (winner === 'O' ? 1 : 0),
        draws: prev.draws + (winner === null ? 1 : 0),
      };
      saveStats(key, next);
      return next;
    });
  }, [mode]);

  const handleCellClick = useCallback((index: number) => {
    if (game.board[index] || game.gameOver || thinking) return;

    const newBoard = [...game.board];
    newBoard[index] = game.currentPlayer;

    if (soundOn) playMoveSound(game.currentPlayer === 'X');

    const history = [...game.history, {
      board: game.board,
      player: game.currentPlayer,
      lastMove: game.lastMove,
    }];

    const result = checkWinner(newBoard);
    if (result) {
      if (soundOn) playWinSound();
      const newState: GameState = {
        board: newBoard,
        currentPlayer: game.currentPlayer,
        gameOver: true,
        winner: result.winner,
        winningCells: result.cells,
        moveCount: game.moveCount + 1,
        lastMove: index,
        history,
      };
      setGame(newState);
      updateStats(result.winner);
      setTimeout(() => setShowModal(true), 600);
      return;
    }

    if (isBoardFull(newBoard)) {
      if (soundOn) playDrawSound();
      setGame({
        board: newBoard,
        currentPlayer: game.currentPlayer,
        gameOver: true,
        winner: null,
        winningCells: [],
        moveCount: game.moveCount + 1,
        lastMove: index,
        history,
      });
      updateStats(null);
      setTimeout(() => setShowModal(true), 600);
      return;
    }

    const nextPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
    setGame({
      board: newBoard,
      currentPlayer: nextPlayer as 'X' | 'O',
      gameOver: false,
      winner: null,
      winningCells: [],
      moveCount: game.moveCount + 1,
      lastMove: index,
      history,
    });

    // AI move
    if (mode === 'bot' && nextPlayer === 'O') {
      setThinking(true);
      setTimeout(() => {
        const currentGame = gameRef.current;
        if (currentGame.gameOver) { setThinking(false); return; }
        const aiMove = getAIMove([...currentGame.board], difficulty);
        if (aiMove === -1) { setThinking(false); return; }

        const aiBoard = [...currentGame.board];
        aiBoard[aiMove] = 'O';

        if (soundOn) playMoveSound(false);

        const aiHistory = [...currentGame.history, {
          board: currentGame.board,
          player: 'O' as const,
          lastMove: currentGame.lastMove,
        }];

        const aiResult = checkWinner(aiBoard);
        if (aiResult) {
          if (soundOn) playWinSound();
          setGame({
            board: aiBoard,
            currentPlayer: 'O',
            gameOver: true,
            winner: aiResult.winner,
            winningCells: aiResult.cells,
            moveCount: currentGame.moveCount + 1,
            lastMove: aiMove,
            history: aiHistory,
          });
          updateStats(aiResult.winner);
          setTimeout(() => setShowModal(true), 600);
        } else if (isBoardFull(aiBoard)) {
          if (soundOn) playDrawSound();
          setGame({
            board: aiBoard,
            currentPlayer: 'O',
            gameOver: true,
            winner: null,
            winningCells: [],
            moveCount: currentGame.moveCount + 1,
            lastMove: aiMove,
            history: aiHistory,
          });
          updateStats(null);
          setTimeout(() => setShowModal(true), 600);
        } else {
          setGame({
            board: aiBoard,
            currentPlayer: 'X',
            gameOver: false,
            winner: null,
            winningCells: [],
            moveCount: currentGame.moveCount + 1,
            lastMove: aiMove,
            history: aiHistory,
          });
        }
        setThinking(false);
      }, difficulty === 'impossible' ? 400 : difficulty === 'hard' ? 300 : 150);
    }
  }, [game, mode, difficulty, soundOn, thinking, updateStats]);

  const handleUndo = () => {
    if (game.history.length === 0 || game.gameOver) return;
    // In bot mode, undo both AI and player move
    const steps = mode === 'bot' && game.history.length >= 2 ? 2 : 1;
    const target = game.history[game.history.length - steps];
    if (soundOn) playUndoSound();
    setGame({
      board: target.board,
      currentPlayer: target.player,
      gameOver: false,
      winner: null,
      winningCells: [],
      moveCount: game.moveCount - steps,
      lastMove: target.lastMove,
      history: game.history.slice(0, -steps),
    });
  };

  const newGame = () => {
    setGame(createInitialState());
    setShowModal(false);
    setThinking(false);
  };

  const resetStats = (key: string) => {
    const empty = { totalGames: 0, xWins: 0, oWins: 0, draws: 0 };
    saveStats(key, empty);
    if (key === 'tactic9_friend') setFriendStats(empty);
    else setBotStats(empty);
  };

  if (page === 'howto') return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={setPage} />
      <div className="max-w-[1400px] mx-auto p-4 mt-8"><HowToPlay /></div>
    </div>
  );

  if (page === 'contact') return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={setPage} />
      <div className="max-w-[1400px] mx-auto p-4 mt-8"><ContactPage /></div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={setPage} />

      {/* Hero */}
      <header className="text-center pt-10 pb-4 px-4">
        <div className="inline-block bg-gradient-to-r from-accent to-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold mb-4 animate-[float_3s_ease-in-out_infinite]">
          🚀 Advanced Strategy Game
        </div>
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tighter mb-3">
          Tactic9
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          9×9 grid, 5 in a row to win. Can you beat the IMPOSSIBLE challenge?
        </p>
      </header>

      {/* Main */}
      <div className="max-w-[1400px] mx-auto px-4 pb-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Game */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-[0_0_40px_hsl(var(--primary)/0.15)]">
          {/* Header */}
          <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              🎮 Game Arena
            </h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSoundOn(!soundOn)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${soundOn ? 'bg-success text-primary-foreground' : 'bg-card-light text-muted-foreground'}`}
              >
                {soundOn ? '🔊' : '🔇'} Sound
              </button>
              <button
                onClick={handleUndo}
                disabled={game.history.length === 0 || game.gameOver || thinking}
                className="px-3 py-2 rounded-xl text-sm font-semibold bg-warning text-background disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
              >
                ↩ Undo
              </button>
              <button
                onClick={newGame}
                className="px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-transform"
              >
                🔄 New Game
              </button>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <ModeButton
              active={mode === 'friend'}
              icon="👥"
              label="vs Friend"
              sub="2 Players"
              onClick={() => { setMode('friend'); newGame(); }}
            />
            <ModeButton
              active={mode === 'bot'}
              icon="🤖"
              label="vs Computer"
              sub="Single Player"
              onClick={() => { setMode('bot'); newGame(); }}
            />
          </div>

          {/* Difficulty */}
          {mode === 'bot' && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {(['easy', 'medium', 'hard', 'impossible'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => { setDifficulty(d); newGame(); }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all
                    ${difficulty === d
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-card border-border text-muted-foreground hover:border-primary'
                    }
                  `}
                >
                  {d === 'impossible' ? '⚠️ IMPOSSIBLE' : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          )}

          {difficulty === 'impossible' && mode === 'bot' && (
            <div className="bg-destructive/20 border-2 border-destructive rounded-xl p-3 mb-4 animate-[shake_0.5s_ease]">
              <h4 className="text-destructive font-bold text-sm flex items-center gap-1">⚠️ IMPOSSIBLE Mode Active</h4>
              <p className="text-destructive/80 text-xs mt-1">Optimized minimax with pattern recognition. Extremely challenging!</p>
            </div>
          )}

          {/* Thinking */}
          {thinking && (
            <div className="flex items-center gap-3 p-3 bg-background rounded-xl mb-4">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full animate-[thinkingBounce_1.4s_ease-in-out_infinite]"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">Computer is calculating...</span>
            </div>
          )}

          <GameBoard
            board={game.board}
            winningCells={game.winningCells}
            lastMove={game.lastMove}
            gameOver={game.gameOver}
            onCellClick={handleCellClick}
          />

          {/* Game Info */}
          <div className="flex justify-between items-center p-4 bg-background rounded-2xl border border-border mt-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Current Turn:</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-primary-foreground
                ${game.currentPlayer === 'X'
                  ? 'bg-gradient-to-br from-accent to-primary'
                  : 'bg-gradient-to-br from-secondary to-warning'
                }`}
              >
                {game.currentPlayer}
              </div>
            </div>
            <span className="text-sm text-muted-foreground">Moves: {game.moveCount}</span>
          </div>

          {/* Status bar */}
          {game.gameOver && (
            <div className={`text-center p-3 mt-4 rounded-xl font-bold text-lg animate-[fadeIn_0.4s_ease]
              ${game.winner
                ? 'bg-success/15 text-success border-2 border-success'
                : 'bg-warning/15 text-warning border-2 border-warning'
              }`}
            >
              {game.winner ? `🏆 Player ${game.winner} Wins!` : "🤝 It's a Draw!"}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <StatsCard
            title="vs Friend"
            icon="👥"
            stats={friendStats}
            onReset={() => resetStats('tactic9_friend')}
            compact
          />
          <StatsCard
            title="vs Computer"
            icon="🤖"
            stats={botStats}
            onReset={() => resetStats('tactic9_bot')}
            compact
          />

          {/* Quick Rules */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              🎯 Quick Rules
            </h3>
            <ul className="space-y-2">
              {['9×9 grid board', 'Connect 5 to win', 'Rows, columns, diagonals', 'X always goes first', 'Undo available'].map(r => (
                <li key={r} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-success font-bold">✓</span> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {showModal && (
        <WinModal
          winner={game.winner}
          isDraw={game.gameOver && !game.winner}
          onNewGame={newGame}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function ModeButton({ active, icon, label, sub, onClick }: {
  active: boolean; icon: string; label: string; sub: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[150px] p-4 rounded-2xl border-2 font-semibold transition-all flex flex-col items-center gap-1
        ${active
          ? 'bg-gradient-to-r from-primary to-secondary border-transparent text-primary-foreground shadow-[0_0_40px_hsl(var(--primary)/0.3)]'
          : 'bg-card border-border text-muted-foreground hover:border-primary hover:-translate-y-1'
        }
      `}
    >
      <span className="text-2xl">{icon}</span>
      <span>{label}</span>
      <span className="text-xs opacity-70">{sub}</span>
    </button>
  );
}
