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

      {/* Main Layout — centered, clean */}
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10">

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tighter">
            Tactic9
          </h1>
          <p className="text-xs text-muted-foreground mt-1">9×9 grid · 5 in a row · Challenge the AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">

          {/* ─── Game Column ─── */}
          <div className="space-y-3">

            {/* Row 1: Mode + Difficulty */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-2 flex-1 min-w-[200px]">
                <ModeButton active={mode === 'friend'} icon="👥" label="vs Friend" onClick={() => { setMode('friend'); newGame(); }} />
                <ModeButton active={mode === 'bot'} icon="🤖" label="vs AI" onClick={() => { setMode('bot'); newGame(); }} />
              </div>
              {mode === 'bot' && (
                <div className="flex rounded-xl overflow-hidden border border-border">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                    <button
                      key={d}
                      onClick={() => { setDifficulty(d); newGame(); }}
                      className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all
                        ${difficulty === d
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card text-muted-foreground hover:bg-primary/10'
                        }
                      `}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Row 2: Actions bar */}
            <div className="flex items-center justify-between gap-2 bg-card/50 rounded-xl px-3 py-2 border border-border/50">
              {/* Turn indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center font-extrabold text-xs text-primary-foreground
                  ${game.currentPlayer === 'X'
                    ? 'bg-gradient-to-br from-accent to-primary'
                    : 'bg-gradient-to-br from-secondary to-warning'
                  }`}
                >
                  {game.currentPlayer}
                </div>
                <span className="text-xs font-medium text-foreground">
                  {thinking ? 'AI thinking…' : game.gameOver
                    ? (game.winner ? `${game.winner} wins!` : 'Draw!')
                    : `${game.currentPlayer}'s turn`}
                </span>
                {thinking && (
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-[thinkingBounce_1.4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                )}
              </div>
              {/* Buttons */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground tabular-nums mr-1 hidden sm:inline">Move {game.moveCount}</span>
                <button onClick={() => setFullscreen(true)} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-background border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all" title="Fullscreen">⛶</button>
                <button onClick={() => setSoundOn(!soundOn)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all border ${soundOn ? 'bg-success/15 border-success/30 text-success' : 'bg-background border-border text-muted-foreground'}`}>{soundOn ? '🔊' : '🔇'}</button>
                <button onClick={handleUndo} disabled={game.history.length === 0 || game.gameOver || thinking} className="h-8 px-2.5 rounded-lg text-[11px] font-semibold bg-warning/15 text-warning border border-warning/30 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-warning hover:text-background transition-all">↩ Undo</button>
                <button onClick={newGame} className="h-8 px-3 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-all">New</button>
              </div>
            </div>

            {/* Board */}
            <div className="bg-card rounded-2xl p-3 sm:p-4 border border-border">
              <GameBoard
                board={game.board}
                winningCells={game.winningCells}
                lastMove={game.lastMove}
                gameOver={game.gameOver}
                onCellClick={handleCellClick}
              />
              {game.gameOver && (
                <div className={`text-center p-2.5 mt-3 rounded-xl font-bold text-sm animate-[fadeIn_0.4s_ease]
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

          {/* ─── Sidebar ─── */}
          <div className="space-y-3 lg:sticky lg:top-4">
            <StatsCard title="vs Friend" icon="👥" stats={friendStats} onReset={() => resetStats('tactic9_friend')} compact />
            <StatsCard title="vs Computer" icon="🤖" stats={botStats} onReset={() => resetStats('tactic9_bot')} compact />
            <div className="bg-card rounded-xl p-3.5 border border-border">
              <h3 className="text-xs font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2.5">
                📖 Quick Guide
              </h3>
              <ul className="space-y-1.5">
                {[
                  'Place X or O on the 9×9 grid',
                  'Connect 5 in a row to win',
                  'Horizontal, vertical, or diagonal',
                  'X always goes first',
                  'Use Undo to take back moves',
                  'Block opponent lines!',
                ].map(r => (
                  <li key={r} className="flex items-start gap-1.5 text-[11px] text-muted-foreground leading-snug">
                    <span className="text-success text-[10px] mt-px">✓</span> {r}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleNavigate('howto')} className="mt-2.5 text-[11px] font-semibold text-primary hover:underline">
                Full guide →
              </button>
            </div>
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

function ModeButton({ active, icon, label, onClick }: {
  active: boolean; icon: string; label: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-3 py-2 rounded-xl border-2 font-semibold transition-all flex items-center justify-center gap-2 text-xs sm:text-sm
        ${active
          ? 'bg-gradient-to-r from-primary to-secondary border-transparent text-primary-foreground shadow-md shadow-primary/20'
          : 'bg-card border-border text-muted-foreground hover:border-primary/50'
        }
      `}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
