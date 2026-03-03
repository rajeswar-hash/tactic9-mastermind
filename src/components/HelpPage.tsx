import { useState } from 'react';

const faqs = [
  {
    q: 'How do I start a game?',
    a: 'Simply click any empty cell on the 9×9 board to place your mark. You can choose to play against a friend or the computer using the mode buttons above the board.',
  },
  {
    q: 'How do I win?',
    a: 'Connect 5 of your marks (X or O) in a continuous line — horizontally, vertically, or diagonally — before your opponent does.',
  },
  {
    q: 'Can I undo a move?',
    a: 'Yes! Click the "↩ Undo" button to take back your last move. In vs Computer mode, it undoes both your move and the computer\'s response.',
  },
  {
    q: 'What do the difficulty levels mean?',
    a: 'Easy: the computer makes mostly random moves. Medium: it blocks threats and takes winning moves. Hard: it uses advanced algorithms to play strategically.',
  },
  {
    q: 'How are statistics tracked?',
    a: 'Your game stats (wins, losses, draws) are saved separately for "vs Friend" and "vs Computer" modes in your browser\'s local storage. You can reset them anytime.',
  },
  {
    q: 'Does the game work on mobile?',
    a: 'Yes! Tactic9 is fully responsive and works on phones, tablets, laptops, and desktops.',
  },
  {
    q: 'Is my data collected?',
    a: 'No. All game data is stored locally on your device. We only collect information you voluntarily submit through the Contact Us form.',
  },
  {
    q: 'How do I report a bug?',
    a: 'Go to the "Contact Us" page, select "Bug Report" as the issue type, and describe the problem. We\'ll look into it as soon as possible.',
  },
  {
    q: 'Can I play with sound off?',
    a: 'Yes. Toggle the sound button (🔊/🔇) in the game header to enable or disable sound effects.',
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-8 bg-card rounded-3xl border border-border animate-[fadeIn_0.4s_ease]">
      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        ❓ Help & FAQ
      </h2>
      <p className="text-muted-foreground mb-6 text-sm sm:text-base">
        Find answers to common questions below. Can't find what you need? Visit our Contact Us page.
      </p>

      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex justify-between items-center p-4 text-left font-semibold text-sm sm:text-base text-foreground hover:bg-card-light/50 transition-colors"
            >
              <span>{faq.q}</span>
              <span className="text-muted-foreground ml-2 shrink-0 transition-transform duration-200"
                style={{ transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▾
              </span>
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed animate-[fadeIn_0.2s_ease]">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-background rounded-xl border border-border text-center">
        <p className="text-sm text-muted-foreground">
          Still need help? <span className="text-primary font-semibold">Contact Us</span> and we'll get back to you as soon as possible.
        </p>
      </div>
    </div>
  );
}
