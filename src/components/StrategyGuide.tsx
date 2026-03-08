export default function StrategyGuide() {
  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-8 bg-card rounded-3xl border border-border animate-[fadeIn_0.4s_ease]">
      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        🧠 Strategy Guide
      </h2>
      <p className="text-xs text-muted-foreground mb-8">Master the art of Tactic9-Mastermind with these comprehensive strategies — from beginner basics to advanced techniques</p>

      <Section title="🎯 Opening Strategy" icon="1">
        <p className="mb-3">The opening moves set the tone for the entire game. Your first few placements determine whether you'll be attacking or defending for the rest of the match.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Control the Center:</strong> The center of the 9×9 grid (around row 5, column 5) gives you the most directions to build lines. Always aim to establish presence here early. A center mark can contribute to horizontal, vertical, and both diagonal lines.</li>
          <li><strong>Avoid Corners Early:</strong> Corner positions limit your line-building options to only 3 directions, while center positions offer up to 4. Save corner plays for mid-game tactical moves.</li>
          <li><strong>Spread Out:</strong> Don't cluster your marks. Place them with 2-3 cell gaps so you can connect them later while keeping multiple threats alive.</li>
          <li><strong>Claim Key Intersections:</strong> Positions where multiple potential 5-in-a-row lines cross are the most valuable. Identify these intersections early and prioritize them.</li>
          <li><strong>Mirror Avoidance:</strong> If your opponent mirrors your moves, break the pattern by switching to an asymmetric strategy. Mirroring can be exploited once recognized.</li>
        </ul>
      </Section>

      <Section title="⚔️ Mid-Game Tactics" icon="2">
        <p className="mb-3">The mid-game is where strategy really matters. This is the phase where games are won or lost based on tactical awareness.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Create Forks (Double Threats):</strong> The most powerful tactic — place a mark that creates two separate 3-in-a-row threats simultaneously. Your opponent can only block one, guaranteeing you extend the other.</li>
          <li><strong>Open-Ended Threes:</strong> A line of 3 marks with both ends open is nearly unstoppable. Your opponent must block immediately or lose. Prioritize creating these over closed-end lines.</li>
          <li><strong>Defensive Reading:</strong> After every move, scan all 4 directions from your opponent's last placement. Count their consecutive marks and act before threats become critical.</li>
          <li><strong>Tempo Control:</strong> Force your opponent to react to your threats instead of building their own. Each defensive move they make is a move not spent attacking. Maintain initiative.</li>
          <li><strong>Line Extension Priority:</strong> When you have multiple lines in progress, extend the one with the most open ends first. Open-ended lines are exponentially more dangerous than blocked ones.</li>
          <li><strong>Threat Hierarchy:</strong> Always evaluate threats in this order: (1) Can I win this turn? (2) Can my opponent win next turn? (3) Can I create a fork? (4) Can my opponent create a fork? (5) Can I extend a line?</li>
        </ul>
      </Section>

      <Section title="🛡️ Defensive Principles" icon="3">
        <p className="mb-3">Even the best attackers need solid defense. A single missed block can cost you the game.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Priority Blocking:</strong> Always block 4-in-a-row first, then open-ended 3s, then closed 3s. Missing a 4-in-a-row block means instant loss.</li>
          <li><strong>Active Defense:</strong> When blocking, choose positions that also advance your own lines. A defensive move that doubles as an offensive setup is the most efficient play.</li>
          <li><strong>Pattern Recognition:</strong> Learn to spot diagonal threats quickly — they're the most commonly missed. Train yourself to scan diagonals after every opponent move.</li>
          <li><strong>Preemptive Blocking:</strong> Don't wait for 4-in-a-row to block. If your opponent has an open-ended 2-in-a-row in a dangerous area, consider disrupting it early.</li>
          <li><strong>Space Denial:</strong> Sometimes the best defense is occupying key positions before your opponent can use them, even if it doesn't immediately advance your own lines.</li>
        </ul>
      </Section>

      <Section title="🔥 Advanced Techniques" icon="4">
        <p className="mb-3">These advanced patterns separate beginners from masters. Study and practice each one.</p>
        <div className="space-y-4">
          <Technique
            name="The Ladder"
            description="Build a staircase pattern diagonally across the board. Each step creates a new threat while maintaining the previous ones. Opponents struggle to block diagonal ladders because they require blocking in an unfamiliar direction."
          />
          <Technique
            name="The Pincer"
            description="Place marks on opposite sides of your opponent's line with gaps. When they extend in one direction, you close in from the other side. This technique forces your opponent into increasingly desperate blocking moves."
          />
          <Technique
            name="The Decoy"
            description="Build a visible but non-critical threat to draw your opponent's attention, then strike with your real attack line on the opposite side of the board. The key is making the decoy look threatening enough to demand a response."
          />
          <Technique
            name="Board Division"
            description="Mentally divide the 9×9 grid into quadrants. Dominate one quadrant while maintaining presence in others. A concentrated force is harder to stop than scattered marks. Once you control a quadrant, expand outward."
          />
          <Technique
            name="The Bridge"
            description="Place two marks with exactly one gap between them. This creates a 'bridge' that can extend in either direction. Multiple bridges in different directions create a web of potential threats that's extremely difficult to defend against."
          />
          <Technique
            name="The Anchor"
            description="Establish a strong mark in a high-value position and build multiple lines radiating from it. This 'anchor' point becomes a force multiplier, making every new mark more threatening because it can connect to the anchor."
          />
        </div>
      </Section>

      <Section title="🤖 Beating the AI" icon="5">
        <p className="mb-3">Each difficulty level requires different approaches. Here's how to consistently win:</p>
        <div className="space-y-3">
          <DifficultyTip level="Easy" emoji="🟢" tips={[
            "Play naturally and build lines — the AI won't always block.",
            "Practice creating open-ended threes without pressure.",
            "Use this mode to experiment with new strategies risk-free.",
            "Focus on learning to recognize winning patterns.",
          ]} />
          <DifficultyTip level="Medium" emoji="🟡" tips={[
            "The AI blocks obvious threats, so use fork tactics.",
            "Create two simultaneous threats to overwhelm its single-block logic.",
            "Set up threats 2-3 moves in advance rather than going for immediate wins.",
            "Use the center and diagonal lines — the AI sometimes undervalues diagonals.",
          ]} />
          <DifficultyTip level="Hard" emoji="🔴" tips={[
            "The AI uses advanced pattern recognition — don't rely on simple traps.",
            "Focus on long-term positional play rather than quick wins.",
            "Control the center and build subtle multi-direction setups.",
            "Create complex forks that require evaluating 3+ moves ahead.",
            "Be patient — winning against Hard AI often takes 20+ moves of careful positioning.",
            "Use the Undo button to study alternative moves and learn from mistakes.",
          ]} />
        </div>
      </Section>

      <Section title="📊 Common Mistakes to Avoid" icon="6">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Tunnel Vision:</strong> Don't focus on one line so much that you miss your opponent's threats elsewhere on the board.</li>
          <li><strong>Edge Addiction:</strong> Playing along the edges limits your options significantly. Stay central when possible.</li>
          <li><strong>Ignoring Diagonals:</strong> New players often only think horizontally and vertically. Diagonals are equally powerful and often harder to spot.</li>
          <li><strong>Reactive Play:</strong> If you're only blocking, you're losing. Always have an offensive plan running alongside your defense.</li>
          <li><strong>Overextending:</strong> Building a line of 4 that's blocked on one end is wasted effort. Ensure your lines have room to grow in at least one direction.</li>
          <li><strong>Forgetting Move Count:</strong> Keep track of how many moves have been played. As the board fills, each move becomes more critical and mistakes are harder to recover from.</li>
          <li><strong>Panic Blocking:</strong> Sometimes a threat isn't as dangerous as it looks. Evaluate whether blocking is truly necessary or if you can create a counter-threat instead.</li>
        </ul>
      </Section>

      <Section title="🏆 Path to Mastery" icon="7">
        <p className="mb-3">Follow this progression to become a Tactic9-Mastermind master:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Learn the Basics:</strong> Play on Easy until you can win consistently. Focus on building 5-in-a-row lines.</li>
          <li><strong>Develop Defense:</strong> Switch to Medium and learn to block while attacking. Master the threat hierarchy.</li>
          <li><strong>Master Forks:</strong> Practice creating double threats. This is the single most important skill in Tactic9-Mastermind.</li>
          <li><strong>Study Patterns:</strong> Learn the advanced techniques (Ladder, Pincer, Decoy, etc.) and practice each one.</li>
          <li><strong>Beat Hard AI:</strong> Challenge yourself on Hard mode. Use Undo to study alternatives and refine your strategy.</li>
          <li><strong>Challenge Friends:</strong> Test your skills against human opponents who can adapt and surprise you.</li>
        </ol>
      </Section>
    </div>
  );
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-bold">{icon}</span>
        <h3 className="text-lg sm:text-xl font-bold text-foreground">{title}</h3>
      </div>
      <div className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-11">{children}</div>
    </div>
  );
}

function Technique({ name, description }: { name: string; description: string }) {
  return (
    <div className="p-4 bg-background rounded-xl border border-border">
      <h4 className="font-bold text-foreground mb-1">{name}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function DifficultyTip({ level, emoji, tips }: { level: string; emoji: string; tips: string[] }) {
  return (
    <div className="p-4 bg-background rounded-xl border border-border">
      <h4 className="font-bold text-foreground mb-2">{emoji} {level}</h4>
      <ul className="list-disc pl-5 space-y-1">
        {tips.map((t, i) => <li key={i} className="text-sm text-muted-foreground">{t}</li>)}
      </ul>
    </div>
  );
}
