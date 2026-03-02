import { CellValue } from '@/lib/gameTypes';

interface GameBoardProps {
  board: CellValue[];
  winningCells: number[];
  lastMove: number | null;
  gameOver: boolean;
  onCellClick: (index: number) => void;
}

export default function GameBoard({ board, winningCells, lastMove, gameOver, onCellClick }: GameBoardProps) {
  return (
    <div className="flex justify-center my-4 sm:my-6 overflow-x-auto p-2 sm:p-4 bg-background rounded-2xl border border-border">
      <div
        className="grid gap-[4px] sm:gap-[6px] p-2 sm:p-3 rounded-2xl bg-card-light"
        style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}
      >
        {board.map((cell, i) => {
          const isWinner = winningCells.includes(i);
          const isLast = lastMove === i;
          const taken = cell !== null;

          return (
            <button
              key={i}
              onClick={() => onCellClick(i)}
              disabled={taken || gameOver}
              className={`
                w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] md:w-[55px] md:h-[55px]
                rounded-[8px] sm:rounded-[10px] flex items-center justify-center
                text-lg sm:text-xl md:text-2xl font-extrabold border-2 transition-all duration-200
                select-none relative overflow-hidden
                ${!taken && !gameOver ? 'cursor-pointer hover:bg-card-light hover:border-primary hover:scale-105 active:scale-95' : ''}
                ${taken ? 'cursor-not-allowed' : ''}
                ${cell === 'X' ? 'text-primary bg-primary/15 border-primary' : ''}
                ${cell === 'O' ? 'text-secondary bg-secondary/15 border-secondary' : ''}
                ${!cell ? 'bg-card border-transparent' : ''}
                ${isWinner ? 'animate-[winnerPulse_0.6s_ease-in-out_infinite_alternate]' : ''}
                ${isLast && !isWinner ? 'border-warning' : ''}
              `}
              style={{
                textShadow: cell === 'X'
                  ? '0 0 20px hsl(var(--primary) / 0.5)'
                  : cell === 'O'
                  ? '0 0 20px hsl(var(--secondary) / 0.5)'
                  : undefined,
                boxShadow: isWinner
                  ? cell === 'X'
                    ? '0 0 25px 5px hsl(var(--primary) / 0.8)'
                    : '0 0 25px 5px hsl(var(--secondary) / 0.8)'
                  : isLast
                  ? '0 0 15px 3px hsl(var(--warning) / 0.5)'
                  : undefined,
              }}
            >
              {cell}
            </button>
          );
        })}
      </div>
    </div>
  );
}
