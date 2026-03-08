import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import GameBoard from '@/components/GameBoard';
import StatsCard from '@/components/StatsCard';
import WinModal from '@/components/WinModal';
import HowToPlay from '@/components/HowToPlay';
import ContactPage from '@/components/ContactPage';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import HelpPage from '@/components/HelpPage';
import TermsOfService from '@/components/TermsOfService';
import AboutPage from '@/components/AboutPage';
import StrategyGuide from '@/components/StrategyGuide';

import {
  GameMode, Difficulty, GameState, GameStats,
  createInitialState, loadStats, saveStats,
} from '@/lib/gameTypes';
import { checkWinner, isBoardFull, getAIMove } from '@/lib/gameAI';
import { playMoveSound, playWinSound, playDrawSound, playUndoSound } from '@/lib/sounds';

type IndexPage = 'home' | 'about' | 'howto' | 'strategy' | 'help' | 'contact' | 'terms' | 'privacy';

const pageToPath: Record<IndexPage, string> = {
  home: '/',
  about: '/about',
  howto: '/howto',
  strategy: '/strategy',
  help: '/help',
  contact: '/contact',
  terms: '/terms',
  privacy: '/privacy',
};

const validPages = new Set<IndexPage>(Object.keys(pageToPath) as IndexPage[]);

interface IndexProps {
  initialPage?: IndexPage;
}

export default function Index({ initialPage = 'home' }: IndexProps) {
  const navigate = useNavigate();
  const safeInitialPage = validPages.has(initialPage) ? initialPage : 'home';

  const [page, setPage] = useState<IndexPage>(safeInitialPage);
  const [mode, setMode] = useState<GameMode>('bot');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [game, setGame] = useState<GameState>(createInitialState());
  const [soundOn, setSoundOn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [friendStats, setFriendStats] = useState<GameStats>(() => loadStats('tactic9_friend'));
  const [botStats, setBotStats] = useState<GameStats>(() => loadStats('tactic9_bot'));

  const gameRef = useRef(game);
  gameRef.current = game;

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
      setGame({
        board: newBoard,
        currentPlayer: game.currentPlayer,
        gameOver: true,
        winner: result.winner,
        winningCells: result.cells,
        moveCount: game.moveCount + 1,
        lastMove: index,
        history,
      });
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
      }, difficulty === 'hard' ? 300 : 150);
    }
  }, [game, mode, difficulty, soundOn, thinking, updateStats]);

  const handleUndo = () => {
    if (game.history.length === 0 || game.gameOver) return;
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

  useEffect(() => {
    setPage(safeInitialPage);
  }, [safeInitialPage]);

  const handleNavigate = useCallback((nextPage: string) => {
    const targetPage = (validPages.has(nextPage as IndexPage) ? nextPage : 'home') as IndexPage;
    setPage(targetPage);
    navigate(pageToPath[targetPage]);
  }, [navigate]);

  if (page === 'howto') return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={handleNavigate} />
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8"><HowToPlay /></div>
    </div>
  );

  if (page === 'contact') return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={handleNavigate} />
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8"><ContactPage /></div>
    </div>
  );

  if (page === 'privacy') return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={handleNavigate} />
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8"><PrivacyPolicy /></div>
    </div>
  );

  if (page === 'help') return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={handleNavigate} />
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8"><HelpPage /></div>
    </div>
  );

  if (page === 'terms') return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={handleNavigate} />
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8"><TermsOfService /></div>
    </div>
  );

  if (page === 'about') return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={handleNavigate} />
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8"><AboutPage /></div>
    </div>
  );

  if (page === 'strategy') return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={handleNavigate} />
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8"><StrategyGuide /></div>
    </div>
  );


  return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={handleNavigate} />

      {/* Hero — compact */}
      <header className="text-center pt-6 sm:pt-8 pb-2 px-4">
        <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tighter mb-1">
          Tactic9
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          9×9 grid · 5 in a row to win · Challenge the AI
        </p>
      </header>

      {/* Main Layout */}
      <div className="max-w-[1100px] mx-auto px-3 sm:px-6 pb-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

        {/* ─── Left: Game Area ─── */}
        <div className="space-y-4">

          {/* Controls Bar */}
          <div className="bg-card rounded-2xl p-3 sm:p-4 border border-border flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Mode Toggle */}
            <div className="flex gap-2 flex-1">
              <ModeButton
                active={mode === 'friend'}
                icon="👥"
                label="vs Friend"
                sub="2P"
                onClick={() => { setMode('friend'); newGame(); }}
              />
              <ModeButton
                active={mode === 'bot'}
                icon="🤖"
                label="vs AI"
                sub="1P"
                onClick={() => { setMode('bot'); newGame(); }}
              />
            </div>

            {/* Difficulty (only in bot mode) */}
            {mode === 'bot' && (
              <div className="flex gap-1.5">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                  <button
                    key={d}
                    onClick={() => { setDifficulty(d); newGame(); }}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide border-2 transition-all
                      ${difficulty === d
                        ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                      }
                    `}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-1.5 sm:ml-auto">
              <button
                onClick={() => setFullscreen(true)}
                className="p-2 rounded-xl text-sm bg-background text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all border border-border"
                title="Fullscreen"
              >
                ⛶
              </button>
              <button
                onClick={() => setSoundOn(!soundOn)}
                className={`p-2 rounded-xl text-sm transition-all border ${soundOn ? 'bg-success/15 border-success/30 text-success' : 'bg-background border-border text-muted-foreground'}`}
              >
                {soundOn ? '🔊' : '🔇'}
              </button>
              <button
                onClick={handleUndo}
                disabled={game.history.length === 0 || game.gameOver || thinking}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-warning/15 text-warning border border-warning/30 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-warning hover:text-background transition-all"
              >
                ↩ Undo
              </button>
              <button
                onClick={newGame}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                New Game
              </button>
            </div>
          </div>

          {/* Board Card */}
          <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-[0_0_60px_hsl(var(--primary)/0.08)]">
            {/* Turn & Status */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm text-primary-foreground
                  ${game.currentPlayer === 'X'
                    ? 'bg-gradient-to-br from-accent to-primary'
                    : 'bg-gradient-to-br from-secondary to-warning'
                  }`}
                >
                  {game.currentPlayer}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {thinking ? 'AI thinking…' : game.gameOver
                    ? (game.winner ? `Player ${game.winner} wins!` : "Draw!")
                    : `Player ${game.currentPlayer}'s turn`}
                </span>
                {thinking && (
                  <div className="flex gap-1 ml-1">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-[thinkingBounce_1.4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">Move {game.moveCount}</span>
            </div>

            <GameBoard
              board={game.board}
              winningCells={game.winningCells}
              lastMove={game.lastMove}
              gameOver={game.gameOver}
              onCellClick={handleCellClick}
            />

            {/* Win/Draw Banner */}
            {game.gameOver && (
              <div className={`text-center p-3 mt-4 rounded-xl font-bold text-base animate-[fadeIn_0.4s_ease]
                ${game.winner
                  ? 'bg-success/10 text-success border border-success/30'
                  : 'bg-warning/10 text-warning border border-warning/30'
                }`}
              >
                {game.winner ? `🏆 Player ${game.winner} Wins!` : "🤝 It's a Draw!"}
              </div>
            )}
          </div>
        </div>

        {/* ─── Right: Sidebar ─── */}
        <div className="space-y-4">
          <StatsCard title="vs Friend" icon="👥" stats={friendStats} onReset={() => resetStats('tactic9_friend')} compact />
          <StatsCard title="vs Computer" icon="🤖" stats={botStats} onReset={() => resetStats('tactic9_bot')} compact />

          {/* Quick Guide */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              📖 Quick Guide
            </h3>
            <ul className="space-y-2">
              {[
                'Place X or O on the 9×9 grid',
                'Connect 5 in a row to win',
                'Horizontal, vertical, or diagonal',
                'X always goes first',
                'Use Undo to take back moves',
                'Block your opponent\'s lines!',
              ].map(r => (
                <li key={r} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className="text-success font-bold mt-0.5">✓</span> {r}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleNavigate('howto')}
              className="mt-3 text-xs font-semibold text-primary hover:underline"
            >
              Full guide →
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Mode */}
      {fullscreen && (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-4">
          {/* Top bar */}
          <div className="w-full max-w-[540px] flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Turn:</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm text-primary-foreground
                ${game.currentPlayer === 'X'
                  ? 'bg-gradient-to-br from-accent to-primary'
                  : 'bg-gradient-to-br from-secondary to-warning'
                }`}
              >
                {game.currentPlayer}
              </div>
              {thinking && (
                <div className="flex gap-1 ml-2">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-[thinkingBounce_1.4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={handleUndo}
                disabled={game.history.length === 0 || game.gameOver || thinking}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-warning text-background disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ↩ Undo
              </button>
              <button
                onClick={newGame}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground"
              >
                🔄 New
              </button>
              <button
                onClick={() => setFullscreen(false)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-card-light text-muted-foreground hover:bg-destructive hover:text-primary-foreground transition-all"
              >
                ✕ Exit
              </button>
            </div>
          </div>

          {/* Board */}
          <div className="w-full max-w-[540px] flex-1 flex items-center justify-center min-h-0">
            <div className="w-full">
              <GameBoard
                board={game.board}
                winningCells={game.winningCells}
                lastMove={game.lastMove}
                gameOver={game.gameOver}
                onCellClick={handleCellClick}
              />
            </div>
          </div>

          {/* Status */}
          {game.gameOver && (
            <div className={`w-full max-w-[540px] text-center p-3 mt-2 rounded-xl font-bold text-base animate-[fadeIn_0.4s_ease]
              ${game.winner
                ? 'bg-success/15 text-success border-2 border-success'
                : 'bg-warning/15 text-warning border-2 border-warning'
              }`}
            >
              {game.winner ? `🏆 Player ${game.winner} Wins!` : "🤝 It's a Draw!"}
            </div>
          )}

          <div className="text-xs text-muted-foreground mt-2">Moves: {game.moveCount}</div>
        </div>
      )}

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
      className={`flex-1 px-3 py-2.5 rounded-xl border-2 font-semibold transition-all flex items-center justify-center gap-2
        ${active
          ? 'bg-gradient-to-r from-primary to-secondary border-transparent text-primary-foreground shadow-md shadow-primary/20'
          : 'bg-background border-border text-muted-foreground hover:border-primary/50'
        }
      `}
    >
      <span className="text-base">{icon}</span>
      <span className="text-xs sm:text-sm">{label}</span>
      <span className="text-[10px] opacity-60 hidden sm:inline">({sub})</span>
    </button>
  );
}
