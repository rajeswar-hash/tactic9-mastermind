export default function HowToPlay() {
  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-8 bg-card rounded-3xl border border-border animate-[fadeIn_0.4s_ease]">
      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        📖 How to Play Tactic9-Mastermind
      </h2>
      <p className="text-xs text-muted-foreground mb-8">Everything you need to know to start playing and winning</p>

      <Section title="🎯 Objective">
        <p>Be the first to connect <strong>5 marks</strong> in a row — horizontally, vertically, or diagonally on a 9×9 grid. The game combines the simplicity of tic-tac-toe with the strategic depth of games like Gomoku and Connect Five.</p>
      </Section>

      <Section title="🎮 Basic Rules">
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>First Move:</strong> Player X always moves first. In vs Computer mode, you play as X.</li>
          <li><strong>Taking Turns:</strong> Players alternate turns, placing their mark (X or O) on any empty cell.</li>
          <li><strong>Winning:</strong> The first player to connect 5 of their marks in a continuous straight line wins.</li>
          <li><strong>Draw:</strong> If all 81 cells are filled with no winner, the game ends in a draw.</li>
          <li><strong>Valid Lines:</strong> Winning lines can be horizontal (→), vertical (↓), or diagonal (↗↘).</li>
          <li><strong>Undo:</strong> Use the Undo button to take back your last move. In vs Computer mode, it undoes both your move and the AI's response.</li>
        </ol>
      </Section>

      <Section title="🕹️ Controls & Interface">
        <ul className="space-y-2">
          <li><strong>🖱️ Click/Tap:</strong> Click or tap any empty cell to place your mark.</li>
          <li><strong>🔄 New Game:</strong> Click "New" to start a fresh game at any time.</li>
          <li><strong>↩ Undo:</strong> Take back your last move (disabled during AI's turn and after game ends).</li>
          <li><strong>🔊/🔇 Sound Toggle:</strong> Enable or disable sound effects for moves, wins, and draws.</li>
          <li><strong>👥/🤖 Mode Switch:</strong> Toggle between playing a friend or the computer.</li>
          <li><strong>Difficulty Selector:</strong> Choose Easy, Medium, or Hard when playing vs Computer.</li>
        </ul>
      </Section>

      <Section title="🤖 Difficulty Levels Explained">
        <div className="space-y-3">
          <DifficultyCard
            level="Easy"
            emoji="🟢"
            description="The computer makes mostly random moves with occasional basic blocking. It won't actively try to win, making it perfect for:"
            points={["Learning the game mechanics", "Practicing line-building strategies", "Casual, relaxed play", "Young or new players"]}
          />
          <DifficultyCard
            level="Medium"
            emoji="🟡"
            description="The computer actively blocks your threats and takes winning moves when available. It provides a balanced challenge:"
            points={["Blocks your 4-in-a-row attempts", "Takes immediate winning opportunities", "Requires you to create multi-directional threats", "Good for intermediate players"]}
          />
          <DifficultyCard
            level="Hard"
            emoji="🔴"
            description="The computer uses advanced minimax search with alpha-beta pruning and pattern recognition. It's a serious opponent:"
            points={["Thinks multiple moves ahead", "Recognizes and counters fork attempts", "Builds its own strategic threats", "Exploits positional weaknesses", "Only beatable with advanced tactics"]}
          />
        </div>
      </Section>

      <Section title="📊 Statistics & Tracking">
        <p className="mb-2">Tactic9-Mastermind tracks your performance separately for each game mode:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Total Games:</strong> Number of games completed</li>
          <li><strong>X Wins:</strong> Games won by Player X</li>
          <li><strong>O Wins:</strong> Games won by Player O (or the computer)</li>
          <li><strong>Draws:</strong> Games that ended with no winner</li>
        </ul>
        <p className="mt-2">Stats are saved in your browser's local storage and persist between sessions. You can reset stats anytime using the reset button on each stats card.</p>
      </Section>

      <Section title="🔊 Sound Effects">
        <p className="mb-2">Tactic9-Mastermind features synthesized sound effects for an immersive experience:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Move Sound:</strong> A distinct tone plays when X or O is placed (different pitches for each player)</li>
          <li><strong>Win Sound:</strong> A celebratory ascending melody plays when a player wins</li>
          <li><strong>Draw Sound:</strong> A neutral tone indicates a drawn game</li>
          <li><strong>Undo Sound:</strong> A descending tone confirms your undo action</li>
        </ul>
        <p className="mt-2">Toggle sounds on/off with the speaker button (🔊/🔇) in the game header.</p>
      </Section>

      <Section title="💡 Quick Tips for Beginners">
        <ul className="space-y-2">
          <li>🎯 <strong>Start in the center</strong> — it gives you the most directions to build lines.</li>
          <li>🛡️ <strong>Always check for threats</strong> — scan the board after every opponent move.</li>
          <li>⚔️ <strong>Build in multiple directions</strong> — don't put all your marks in one line.</li>
          <li>🧠 <strong>Think ahead</strong> — consider where your opponent will play next.</li>
          <li>↗️ <strong>Don't forget diagonals</strong> — they're the most commonly missed winning paths.</li>
          <li>🔄 <strong>Use Undo to learn</strong> — try different moves and see what works best.</li>
          <li>📖 <strong>Check the Strategy Guide</strong> — for advanced tactics and techniques.</li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">{title}</h3>
      <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

function DifficultyCard({ level, emoji, description, points }: { level: string; emoji: string; description: string; points: string[] }) {
  return (
    <div className="p-4 bg-background rounded-xl border border-border">
      <h4 className="font-bold text-foreground mb-2">{emoji} {level}</h4>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <ul className="list-disc pl-5 space-y-1">
        {points.map((p, i) => <li key={i} className="text-sm text-muted-foreground">{p}</li>)}
      </ul>
    </div>
  );
}
