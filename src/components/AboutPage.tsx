export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-8 bg-card rounded-3xl border border-border animate-[fadeIn_0.4s_ease]">
      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
        ℹ️ About Tactic9
      </h2>

      <Section title="What is Tactic9?">
        <p>Tactic9 is an advanced strategy game that evolves the classic tic-tac-toe into a deeper, more engaging experience. Played on a 9×9 grid, players must connect five marks in a row — horizontally, vertically, or diagonally — to win.</p>
      </Section>

      <Section title="Our Mission">
        <p>We believe great games don't need to be complicated. Tactic9 is designed to be instantly accessible yet endlessly strategic. Whether you're a casual player looking for a quick mental challenge or a strategy enthusiast seeking depth, Tactic9 delivers.</p>
      </Section>

      <Section title="Features">
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Smart AI Opponent</strong> — Three difficulty levels powered by minimax algorithms with alpha-beta pruning</li>
          <li><strong>Local Multiplayer</strong> — Challenge a friend on the same device</li>
          <li><strong>Sound Effects</strong> — Immersive audio feedback for moves and victories</li>
          <li><strong>Statistics Tracking</strong> — Separate stats for AI and friend games</li>
          <li><strong>Responsive Design</strong> — Play seamlessly on any device</li>
          <li><strong>Undo System</strong> — Take back moves to explore strategies</li>
          <li><strong>No Account Required</strong> — Just open and play instantly</li>
        </ul>
      </Section>

      <Section title="Technology">
        <p>Tactic9 is built with modern web technologies for a fast, smooth experience. The game runs entirely in your browser with no server-side processing required for gameplay. Your data stays on your device.</p>
      </Section>

      <Section title="Accessibility">
        <p>Tactic9 is designed to be accessible on all devices — desktop, laptop, tablet, and mobile. We're committed to making the game enjoyable for everyone, regardless of device or screen size.</p>
      </Section>

      <Section title="Feedback">
        <p>We love hearing from our players! If you have suggestions, bug reports, or just want to say hello, visit our <strong>Contact Us</strong> page. Your feedback helps us make Tactic9 better.</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">{title}</h3>
      <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
