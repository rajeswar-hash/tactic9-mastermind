interface WinModalProps {
  winner: string | null;
  isDraw: boolean;
  onNewGame: () => void;
  onClose: () => void;
}

export default function WinModal({ winner, isDraw, onNewGame, onClose }: WinModalProps) {
  if (!winner && !isDraw) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.3s_ease]"
      onClick={onClose}
    >
      <div
        className="bg-card p-8 rounded-3xl max-w-md text-center border border-border shadow-2xl animate-[popIn_0.4s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-6xl mb-4 animate-[bounce_1s_ease_infinite]">
          {isDraw ? '🤝' : '🏆'}
        </div>
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
          {isDraw ? "It's a Draw!" : `Player ${winner} Wins!`}
        </h2>
        <p className="text-muted-foreground mb-6">
          {isDraw ? 'An epic battle with no clear winner!' : `Congratulations! ${winner} dominated the board!`}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={onNewGame}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/40 hover:-translate-y-1 transition-transform"
          >
            🔄 Play Again
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-semibold bg-card-light text-foreground hover:-translate-y-1 transition-transform"
          >
            Review Board
          </button>
        </div>
      </div>
    </div>
  );
}
