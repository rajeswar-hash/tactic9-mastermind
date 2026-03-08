import { useState } from 'react';

const faqCategories = [
  {
    category: "Getting Started",
    faqs: [
      {
        q: 'How do I start a game?',
        a: 'Simply click any empty cell on the 9×9 board to place your mark. You can choose to play against a friend or the computer using the mode buttons above the board. Player X always goes first.',
      },
      {
        q: 'How do I win?',
        a: 'Connect 5 of your marks (X or O) in a continuous line — horizontally, vertically, or diagonally — before your opponent does. The winning cells will be highlighted with a special animation.',
      },
      {
        q: 'What happens if the board fills up?',
        a: 'If all 81 cells are filled and no player has connected 5 in a row, the game ends in a draw. A draw sound will play and the result modal will show "It\'s a Draw!"',
      },
      {
        q: 'Do I need to create an account?',
        a: 'No! Tactic9-Mastermind is completely free and requires no account, registration, or download. Just open the website and start playing immediately.',
      },
    ]
  },
  {
    category: "Gameplay",
    faqs: [
      {
        q: 'Can I undo a move?',
        a: 'Yes! Click the "↩ Undo" button to take back your last move. In vs Computer mode, it undoes both your move and the computer\'s response, so you return to your previous turn.',
      },
      {
        q: 'What do the difficulty levels mean?',
        a: 'Easy: the computer makes mostly random moves with basic blocking — great for beginners. Medium: it actively blocks threats and takes winning opportunities — good for intermediate players. Hard: it uses advanced minimax algorithms with pattern recognition — a real challenge even for experienced players.',
      },
      {
        q: 'Can I switch between vs Friend and vs Computer during a game?',
        a: 'Yes, but switching modes will start a new game. Your current game progress will be lost. Statistics are tracked separately for each mode.',
      },
      {
        q: 'Why is the computer taking a moment to move on Hard difficulty?',
        a: 'On Hard mode, the AI performs a deeper search through possible moves using the minimax algorithm. This calculation takes a fraction of a second longer to ensure the best possible move. You\'ll see a "Computer is thinking..." indicator.',
      },
      {
        q: 'Can I play with sound off?',
        a: 'Yes. Toggle the sound button (🔊/🔇) in the game header to enable or disable all sound effects including move sounds, win/draw sounds, and undo sounds.',
      },
    ]
  },
  {
    category: "Statistics & Data",
    faqs: [
      {
        q: 'How are statistics tracked?',
        a: 'Your game stats (wins, losses, draws, total games) are saved separately for "vs Friend" and "vs Computer" modes in your browser\'s local storage. They persist between sessions unless you clear your browser data.',
      },
      {
        q: 'Can I reset my statistics?',
        a: 'Yes! Each stats card has a reset button. Clicking it will clear all statistics for that specific mode (vs Friend or vs Computer). This action cannot be undone.',
      },
      {
        q: 'Will I lose my stats if I clear my browser data?',
        a: 'Yes. Since stats are stored in your browser\'s local storage, clearing your browser data, cookies, or site data will remove your game statistics. There is currently no cloud backup for stats.',
      },
      {
        q: 'Is my data collected or sent to any server?',
        a: 'All game data (stats, preferences) is stored locally on your device and never sent to any server. The only information transmitted is what you voluntarily submit through the Contact Us form, which is sent to our team via email.',
      },
    ]
  },
  {
    category: "Technical & Troubleshooting",
    faqs: [
      {
        q: 'Does the game work on mobile?',
        a: 'Yes! Tactic9-Mastermind is fully responsive and works on phones, tablets, laptops, and desktops. The 9×9 grid automatically scales to fit your screen size.',
      },
      {
        q: 'Which browsers are supported?',
        a: 'Tactic9-Mastermind works on all modern browsers including Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, and Brave. We recommend using the latest version for the best experience.',
      },
      {
        q: 'The game seems stuck or unresponsive. What should I do?',
        a: 'Try refreshing the page. If the problem persists, clear your browser cache and reload. Your statistics will be preserved in local storage. If the issue continues, please report it through our Contact Us page.',
      },
      {
        q: 'Sound effects aren\'t working. How do I fix this?',
        a: 'First, ensure the sound toggle (🔊) is enabled in the game header. Some browsers block audio until you interact with the page — try clicking the sound button off and on again. On mobile, ensure your device isn\'t in silent mode.',
      },
      {
        q: 'How do I report a bug?',
        a: 'Go to the "Contact Us" page, select "Bug Report" as the issue type, and describe the problem in detail. Include your browser name, device type, and steps to reproduce the issue. We\'ll investigate as soon as possible.',
      },
    ]
  },
  {
    category: "General",
    faqs: [
      {
        q: 'Is Tactic9-Mastermind free?',
        a: 'Yes, Tactic9-Mastermind is completely free to play. There are no ads, no in-app purchases, and no premium features locked behind paywalls. Everyone gets the full experience.',
      },
      {
        q: 'Can I share or embed Tactic9-Mastermind?',
        a: 'You can share the URL with friends so they can play on their own devices. Currently, there is no embeddable widget, but you can link to the game from your website or social media.',
      },
      {
        q: 'Will there be multiplayer over the internet?',
        a: 'Online multiplayer is something we\'re considering for future updates. Currently, multiplayer is available as local (same device) play. Stay tuned for announcements!',
      },
    ]
  }
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-8 bg-card rounded-3xl border border-border animate-[fadeIn_0.4s_ease]">
      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        ❓ Help & FAQ
      </h2>
      <p className="text-muted-foreground mb-8 text-sm sm:text-base">
        Find answers to common questions below, organized by category. Can't find what you need? Visit our Contact Us page.
      </p>

      {faqCategories.map((cat, catIndex) => (
        <div key={catIndex} className="mb-8">
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-bold">{catIndex + 1}</span>
            {cat.category}
          </h3>
          <div className="space-y-2">
            {cat.faqs.map((faq, i) => {
              const key = `${catIndex}-${i}`;
              return (
                <div key={key} className="border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === key ? null : key)}
                    className="w-full flex justify-between items-center p-4 text-left font-semibold text-sm sm:text-base text-foreground hover:bg-background/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-muted-foreground ml-2 shrink-0 transition-transform duration-200"
                      style={{ transform: openIndex === key ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      ▾
                    </span>
                  </button>
                  {openIndex === key && (
                    <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed animate-[fadeIn_0.2s_ease]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-8 p-5 bg-background rounded-xl border border-border">
        <h3 className="font-bold text-foreground mb-2">📧 Still Need Help?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          If you couldn't find the answer you're looking for, don't hesitate to reach out. Our team is here to help!
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Visit the <strong className="text-primary">Contact Us</strong> page to send us a message</li>
          <li>• Select the appropriate issue type for faster response</li>
          <li>• Include as much detail as possible about your question or issue</li>
          <li>• We typically respond within 24-48 hours</li>
        </ul>
      </div>
    </div>
  );
}
