export default function HowToPlay() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-card rounded-3xl border border-border animate-[fadeIn_0.4s_ease]">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
        📖 How to Play Tactic9
      </h2>

      <Section title="🎯 Objective">
        <p>Be the first to connect <strong>5 marks</strong> in a row — horizontally, vertically, or diagonally on a 9×9 grid.</p>
      </Section>

      <Section title="🎮 Game Rules">
        <ol className="list-decimal pl-5 space-y-2">
          <li>Player X always moves first.</li>
          <li>Players alternate turns placing X or O.</li>
          <li>First to connect 5 in a line wins.</li>
          <li>If all 81 cells fill with no winner, it's a draw.</li>
          <li>Use Undo to take back your last move.</li>
        </ol>
      </Section>

      <Section title="🤖 Difficulty Levels">
        <ul className="space-y-2">
          <li><strong>Easy:</strong> Random moves with basic blocking.</li>
          <li><strong>Medium:</strong> Blocks threats and takes wins.</li>
          <li><strong>Hard:</strong> Minimax search, 3 moves deep.</li>
          <li><strong>Impossible:</strong> Deep minimax with pattern recognition.</li>
        </ul>
      </Section>

      <Section title="💡 Strategy Tips">
        <ul className="space-y-2">
          <li>🎯 Control the center for maximum options.</li>
          <li>🛡️ Always block opponent's 4-in-a-row threats.</li>
          <li>⚔️ Create double threats — two ways to win at once.</li>
          <li>🧠 Think 3+ moves ahead.</li>
          <li>↗️ Don't ignore diagonal lines.</li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
