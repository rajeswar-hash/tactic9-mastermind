import { useState } from 'react';

interface Puzzle {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  scenario: string;
  hint: string;
  solution: string;
  boardPreview: string[];
}

const puzzles: Puzzle[] = [
  {
    id: 1,
    title: "The Winning Move",
    difficulty: "Easy",
    description: "You're X. Find the move that wins the game immediately.",
    scenario: "X has 4 in a row horizontally with one open end. Where do you place your mark?",
    hint: "Look for an open cell at the end of the existing X line.",
    solution: "Place X at the open end of the 4-in-a-row line to complete 5 and win!",
    boardPreview: ["·","·","·","·","·","·","·","·","·","·","·","·","·","·","·","·","·","·","·","·","X","X","X","X","?","·","·","·","·","·","·","·","·","·","·","·"],
  },
  {
    id: 2,
    title: "Block or Lose",
    difficulty: "Easy",
    description: "You're X. O has a dangerous threat. Find the critical block.",
    scenario: "O has 4 in a row vertically. If you don't block, O wins next turn.",
    hint: "Scan the columns for O's consecutive marks and block the 5th position.",
    solution: "Block at the open end of O's 4-in-a-row column to prevent their win!",
    boardPreview: ["·","·","·","·","·","·","·","O","·","·","·","·","·","·","O","·","·","·","·","·","·","O","·","·","·","·","·","O","·","·","·","·","·","?","·","·"],
  },
  {
    id: 3,
    title: "The Fork",
    difficulty: "Medium",
    description: "Create a fork — two winning threats at once.",
    scenario: "Place X so it creates threats in two directions simultaneously. O can only block one!",
    hint: "Find a position where your mark extends two separate lines to 4-in-a-row.",
    solution: "Place at the intersection point that creates two open-ended threats. O cannot block both!",
    boardPreview: ["·","·","·","·","·","·","·","·","·","·","X","·","·","·","·","·","X","·","·","·","X","?","·","X","·","·","·","·","·","·","X","·","·","·","·","·"],
  },
  {
    id: 4,
    title: "Diagonal Danger",
    difficulty: "Medium",
    description: "Spot the diagonal winning opportunity that's easy to miss.",
    scenario: "X has marks scattered diagonally. Find the move that sets up an unstoppable diagonal win.",
    hint: "Check all diagonal directions — the winning path might not be obvious.",
    solution: "The diagonal from top-left to bottom-right has 3 X marks with gaps. Fill the key gap to create an open-ended 4!",
    boardPreview: ["X","·","·","·","·","·","·","X","·","·","·","·","·","·","?","·","·","·","·","·","·","X","·","·","·","·","·","·","X","·","·","·","·","·","·","·"],
  },
  {
    id: 5,
    title: "The Sacrifice",
    difficulty: "Hard",
    description: "Sometimes the best move isn't the obvious one.",
    scenario: "You could extend your 3-in-a-row, but there's a better strategic move elsewhere on the board.",
    hint: "Ignore the tempting extension. Look for a position that creates a fork on your NEXT move.",
    solution: "Instead of extending to 4 (which O will block), place away from your main line to set up a guaranteed fork next turn.",
    boardPreview: ["·","·","·","·","·","·","·","·","·","X","X","X","·","·","·","·","·","·","·","·","·","·","?","·","·","·","·","·","·","·","·","·","·","·","·","·"],
  },
  {
    id: 6,
    title: "Endgame Mastery",
    difficulty: "Hard",
    description: "The board is filling up. Find the only winning path.",
    scenario: "With limited empty cells remaining, you must find the precise sequence of moves that forces a win.",
    hint: "Count the remaining empty cells and trace every possible line. Only one path leads to 5-in-a-row.",
    solution: "With the board nearly full, the winning move creates a threat that O cannot block because they must also defend another line.",
    boardPreview: ["X","O","X","O","·","O","O","X","O","X","X","O","X","·","X","O","X","O","O","X","O","?","O","X","X","O","X","O","·","X","O","X","O","X","O","X"],
  },
];

export default function PuzzleChallenges() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [showSolution, setShowSolution] = useState<Record<number, boolean>>({});

  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-8 bg-card rounded-3xl border border-border animate-[fadeIn_0.4s_ease]">
      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        🧩 Puzzle Challenges
      </h2>
      <p className="text-sm text-muted-foreground mb-8">
        Sharpen your skills with these tactical puzzles. Each puzzle presents a critical game moment — find the best move!
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(['Easy', 'Medium', 'Hard'] as const).map(d => {
          const colors = { Easy: '🟢', Medium: '🟡', Hard: '🔴' };
          const count = puzzles.filter(p => p.difficulty === d).length;
          return (
            <span key={d} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-background border border-border text-muted-foreground">
              {colors[d]} {d} — {count} puzzles
            </span>
          );
        })}
      </div>

      <div className="space-y-4">
        {puzzles.map(puzzle => (
          <div
            key={puzzle.id}
            className={`rounded-2xl border transition-all overflow-hidden ${
              selectedPuzzle === puzzle.id
                ? 'border-primary bg-background shadow-lg shadow-primary/10'
                : 'border-border bg-background hover:border-primary/50'
            }`}
          >
            <button
              onClick={() => setSelectedPuzzle(selectedPuzzle === puzzle.id ? null : puzzle.id)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  #{puzzle.id}
                </span>
                <div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base">{puzzle.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${
                      puzzle.difficulty === 'Easy' ? 'bg-success/15 text-success' :
                      puzzle.difficulty === 'Medium' ? 'bg-warning/15 text-warning' :
                      'bg-destructive/15 text-destructive'
                    }`}>
                      {puzzle.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-muted-foreground text-lg">{selectedPuzzle === puzzle.id ? '▲' : '▼'}</span>
            </button>

            {selectedPuzzle === puzzle.id && (
              <div className="px-4 sm:px-5 pb-5 animate-[fadeIn_0.3s_ease]">
                <p className="text-sm text-muted-foreground mb-3">{puzzle.description}</p>

                <div className="p-4 bg-card rounded-xl border border-border mb-4">
                  <h4 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Scenario</h4>
                  <p className="text-sm text-muted-foreground">{puzzle.scenario}</p>
                </div>

                {/* Mini board preview */}
                <div className="flex justify-center mb-4">
                  <div className="grid grid-cols-9 gap-0.5 w-fit">
                    {puzzle.boardPreview.map((cell, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded text-[10px] sm:text-xs font-bold border ${
                          cell === 'X' ? 'bg-primary/20 text-primary border-primary/30' :
                          cell === 'O' ? 'bg-secondary/20 text-secondary border-secondary/30' :
                          cell === '?' ? 'bg-warning/20 text-warning border-warning/50 animate-pulse' :
                          'bg-background border-border text-muted-foreground/30'
                        }`}
                      >
                        {cell === '·' ? '' : cell}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowHint(prev => ({ ...prev, [puzzle.id]: !prev[puzzle.id] }))}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-warning/15 text-warning border border-warning/30 hover:bg-warning/25 transition-colors"
                  >
                    {showHint[puzzle.id] ? '🙈 Hide Hint' : '💡 Show Hint'}
                  </button>
                  <button
                    onClick={() => setShowSolution(prev => ({ ...prev, [puzzle.id]: !prev[puzzle.id] }))}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-success/15 text-success border border-success/30 hover:bg-success/25 transition-colors"
                  >
                    {showSolution[puzzle.id] ? '🙈 Hide Solution' : '✅ Show Solution'}
                  </button>
                </div>

                {showHint[puzzle.id] && (
                  <div className="mt-3 p-3 bg-warning/10 rounded-xl border border-warning/20 animate-[fadeIn_0.3s_ease]">
                    <p className="text-sm text-warning font-medium">💡 {puzzle.hint}</p>
                  </div>
                )}

                {showSolution[puzzle.id] && (
                  <div className="mt-3 p-3 bg-success/10 rounded-xl border border-success/20 animate-[fadeIn_0.3s_ease]">
                    <p className="text-sm text-success font-medium">✅ {puzzle.solution}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
