export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-8 bg-card rounded-3xl border border-border animate-[fadeIn_0.4s_ease]">
      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        ℹ️ About Tactic9-Mastermind
      </h2>
      <p className="text-xs text-muted-foreground mb-8">Learn everything about the game that redefines strategic thinking</p>

      <Section title="What is Tactic9-Mastermind?">
        <p>Tactic9-Mastermind is an advanced strategy game that evolves the classic tic-tac-toe into a deeper, more engaging experience. Played on a 9×9 grid, players must connect five marks in a row — horizontally, vertically, or diagonally — to win.</p>
        <p className="mt-2">Unlike traditional 3×3 tic-tac-toe which often ends in draws, Tactic9-Mastermind's expanded board creates virtually unlimited strategic possibilities. Every game is unique, and mastery requires both tactical awareness and long-term planning.</p>
      </Section>

      <Section title="Our Mission">
        <p>We believe great games don't need to be complicated. Tactic9-Mastermind is designed to be instantly accessible yet endlessly strategic. Whether you're a casual player looking for a quick mental challenge or a strategy enthusiast seeking depth, Tactic9-Mastermind delivers.</p>
        <p className="mt-2">Our goal is to create a game that anyone can pick up in seconds but takes a lifetime to master. We're committed to keeping Tactic9-Mastermind free, fast, and fun for everyone.</p>
      </Section>

      <Section title="Game Modes">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          <InfoCard emoji="👥" title="vs Friend (Local Multiplayer)" description="Challenge a friend on the same device. Take turns placing X and O on the board. Perfect for game nights, classrooms, or casual competition." />
          <InfoCard emoji="🤖" title="vs Computer (Single Player)" description="Test your skills against our AI opponent with three difficulty levels. From beginner-friendly to brutally challenging, there's a level for everyone." />
        </div>
      </Section>

      <Section title="Features">
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Smart AI Opponent</strong> — Three difficulty levels powered by minimax algorithms with alpha-beta pruning for intelligent, challenging gameplay</li>
          <li><strong>Local Multiplayer</strong> — Challenge a friend on the same device with seamless turn-based play</li>
          <li><strong>Sound Effects</strong> — Immersive audio feedback for moves, victories, draws, and undo actions</li>
          <li><strong>Statistics Tracking</strong> — Separate detailed stats for AI and friend games including wins, losses, draws, and total games</li>
          <li><strong>Responsive Design</strong> — Play seamlessly on any device — phones, tablets, laptops, and desktops</li>
          <li><strong>Undo System</strong> — Take back moves to explore different strategies and learn from mistakes</li>
          <li><strong>No Account Required</strong> — Just open and play instantly. No sign-ups, no downloads, no ads</li>
          <li><strong>Dark Theme</strong> — A sleek, modern dark interface that's easy on the eyes during long gaming sessions</li>
          <li><strong>Win Highlighting</strong> — Winning cells are visually highlighted with animations so you can see exactly how the game was won</li>
          <li><strong>Move Counter</strong> — Track the number of moves made in each game for performance analysis</li>
        </ul>
      </Section>

      <Section title="AI Difficulty Levels">
        <div className="space-y-3 mt-2">
          <InfoCard emoji="🟢" title="Easy Mode" description="The AI makes mostly random moves with basic threat detection. Perfect for beginners learning the game mechanics and experimenting with different strategies without pressure." />
          <InfoCard emoji="🟡" title="Medium Mode" description="The AI actively blocks your threats and takes winning opportunities when available. A balanced challenge that tests your ability to create multi-directional attacks." />
          <InfoCard emoji="🔴" title="Hard Mode" description="Advanced minimax search with alpha-beta pruning and pattern recognition. The AI thinks multiple moves ahead and exploits positional weaknesses. Only the most skilled players can consistently win." />
        </div>
      </Section>

      <Section title="Technology">
        <p>Tactic9-Mastermind is built with cutting-edge web technologies for a fast, smooth, and reliable experience:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>React</strong> — Component-based UI architecture for responsive, dynamic gameplay</li>
          <li><strong>TypeScript</strong> — Type-safe code ensuring reliability and fewer bugs</li>
          <li><strong>Tailwind CSS</strong> — Modern utility-first styling for a polished, consistent design</li>
          <li><strong>Web Audio API</strong> — Real-time sound synthesis for immersive audio without loading external files</li>
          <li><strong>Local Storage</strong> — Your stats and preferences stay on your device — no server needed</li>
        </ul>
        <p className="mt-2">Gameplay runs entirely in your browser with no server-side processing. Contact form submissions are handled by a secure backend service. This means instant load times, no lag, and complete privacy for your gameplay.</p>
      </Section>

      <Section title="Accessibility & Compatibility">
        <p>Tactic9-Mastermind is designed to work everywhere:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>✅ All modern browsers (Chrome, Firefox, Safari, Edge)</li>
          <li>✅ Mobile devices (iOS and Android)</li>
          <li>✅ Tablets and iPads</li>
          <li>✅ Laptops and desktops</li>
          <li>✅ Touch screens and mouse/keyboard input</li>
          <li>✅ Various screen sizes from 320px to 4K displays</li>
        </ul>
      </Section>


      <Section title="Feedback & Support">
        <p>We love hearing from our players! If you have suggestions, bug reports, feature requests, or just want to say hello, visit our <strong>Contact Us</strong> page. Your feedback directly shapes the future of Tactic9-Mastermind.</p>
        <p className="mt-2">Join our community of strategy enthusiasts and help us make Tactic9-Mastermind the best it can be!</p>
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

function InfoCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="p-4 bg-background rounded-xl border border-border">
      <div className="text-2xl mb-2">{emoji}</div>
      <h4 className="font-bold text-foreground text-sm mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function VersionEntry({ version, date, changes }: { version: string; date: string; changes: string[] }) {
  return (
    <div className="p-4 bg-background rounded-xl border border-border">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 bg-primary/15 text-primary rounded-md text-xs font-bold">v{version}</span>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      <ul className="list-disc pl-5 space-y-1">
        {changes.map((c, i) => <li key={i} className="text-xs sm:text-sm text-muted-foreground">{c}</li>)}
      </ul>
    </div>
  );
}
