import { useEffect, useState } from 'react';

interface WinModalProps {
  winner: string | null;
  isDraw: boolean;
  onNewGame: () => void;
  onClose: () => void;
}

export default function WinModal({ winner, isDraw, onNewGame, onClose }: WinModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!winner && !isDraw) return null;

  return (
    <div
      className={`fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`bg-card p-8 sm:p-10 rounded-3xl max-w-md w-full text-center border border-border shadow-2xl transition-all duration-700 ease-out ${visible ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-8 opacity-0'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`text-6xl sm:text-7xl mb-5 transition-transform duration-1000 ease-out ${visible ? 'scale-100' : 'scale-0'}`}>
          {isDraw ? '🤝' : '🏆'}
        </div>
        <h2 className={`text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {isDraw ? "It's a Draw!" : `Player ${winner} Wins!`}
        </h2>
        <p className={`text-muted-foreground mb-7 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {isDraw ? 'An epic battle with no clear winner!' : `Congratulations! ${winner} dominated the board!`}
        </p>
        <div className={`flex gap-3 justify-center flex-wrap transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={onNewGame}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/40 hover:-translate-y-1 transition-transform"
          >
            🔄 Play Again
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-semibold bg-muted/20 border border-border text-foreground hover:-translate-y-1 transition-transform"
          >
            Review Board
          </button>
        </div>
      </div>
    </div>
  );
}
