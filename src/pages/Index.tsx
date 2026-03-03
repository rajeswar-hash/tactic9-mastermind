import { useState, useCallback, useRef } from 'react';
import NavBar from '@/components/NavBar';
import GameBoard from '@/components/GameBoard';
import StatsCard from '@/components/StatsCard';
import WinModal from '@/components/WinModal';
import HowToPlay from '@/components/HowToPlay';
import ContactPage from '@/components/ContactPage';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import HelpPage from '@/components/HelpPage';
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

  if (page === 'howto') return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={setPage} />
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8"><HowToPlay /></div>
    </div>
  );

  if (page === 'contact') return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={setPage} />
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8"><ContactPage /></div>
    </div>
  );

  if (page === 'privacy') return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={setPage} />
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8"><PrivacyPolicy /></div>
    </div>
  );

  if (page === 'help') return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={setPage} />
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8"><HelpPage /></div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <NavBar currentPage={page} onNavigate={setPage} />

      {/* Hero */}
      <header className="text-center pt-8 sm:pt-10 pb-3 sm:pb-4 px-4">
        <div className="inline-block bg-gradient-to-r from-accent to-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 animate-[float_3s_ease-in-out_infinite]">
          🚀 Advanced Strategy Game
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tighter mb-2 sm:mb-3">
          Tactic9
        </h1>
        <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto">
          9×9 grid, 5 in a row to win. Challenge yourself against the smartest AI opponent!
        </p>
      </header>

      {/* Main */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 pb-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 sm:gap-6">
        {/* Game */}
        <div className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-border shadow-[0_0_40px_hsl(var(--primary)/0.15)]">
          {/* Header */}
          <div className="flex justify-between items-center flex-wrap gap-2 sm:gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              🎮 Game Arena
            </h2>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              <button
                onClick={() => setSoundOn(!soundOn)}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${soundOn ? 'bg-success text-primary-foreground' : 'bg-card-light text-muted-foreground'}`}
              >
                {soundOn ? '🔊' : '🔇'}
              </button>
              <button
                onClick={handleUndo}
                disabled={game.history.length === 0 || game.gameOver || thinking}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-warning text-background disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
              >
                ↩ Undo
              </button>
              <button
                onClick={newGame}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-transform"
              >
                🔄 New
              </button>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="flex gap-2 sm:gap-3 mb-4">
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
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => { setDifficulty(d); newGame(); }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all
                    ${difficulty === d
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-card border-border text-muted-foreground hover:border-primary'
                    }
                  `}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
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
              <span className="text-muted-foreground text-xs sm:text-sm">Computer is thinking...</span>
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
          <div className="flex justify-between items-center p-3 sm:p-4 bg-background rounded-xl sm:rounded-2xl border border-border mt-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-muted-foreground">Turn:</span>
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-extrabold text-sm sm:text-base text-primary-foreground
                ${game.currentPlayer === 'X'
                  ? 'bg-gradient-to-br from-accent to-primary'
                  : 'bg-gradient-to-br from-secondary to-warning'
                }`}
              >
                {game.currentPlayer}
              </div>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">Moves: {game.moveCount}</span>
          </div>

          {/* Status bar */}
          {game.gameOver && (
            <div className={`text-center p-3 mt-4 rounded-xl font-bold text-base sm:text-lg animate-[fadeIn_0.4s_ease]
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
          <StatsCard title="vs Friend" icon="👥" stats={friendStats} onReset={() => resetStats('tactic9_friend')} compact />
          <StatsCard title="vs Computer" icon="🤖" stats={botStats} onReset={() => resetStats('tactic9_bot')} compact />

          {/* How to Play - Quick Guide */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              📖 How to Play
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
                <li key={r} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span className="text-success font-bold text-xs">✓</span> {r}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setPage('howto')}
              className="mt-3 text-xs font-semibold text-primary hover:underline"
            >
              Read full guide →
            </button>
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
      className={`flex-1 min-w-[120px] p-3 sm:p-4 rounded-2xl border-2 font-semibold transition-all flex flex-col items-center gap-1
        ${active
          ? 'bg-gradient-to-r from-primary to-secondary border-transparent text-primary-foreground shadow-[0_0_40px_hsl(var(--primary)/0.3)]'
          : 'bg-card border-border text-muted-foreground hover:border-primary hover:-translate-y-1'
        }
      `}
    >
      <span className="text-xl sm:text-2xl">{icon}</span>
      <span className="text-sm">{label}</span>
      <span className="text-[10px] sm:text-xs opacity-70">{sub}</span>
    </button>
  );
}
