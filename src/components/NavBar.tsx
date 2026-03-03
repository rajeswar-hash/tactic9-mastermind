import { useState } from 'react';

interface NavBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const pages = [
  { id: 'home', label: 'Home' },
  { id: 'howto', label: 'How to Play' },
  { id: 'help', label: 'Help' },
  { id: 'contact', label: 'Contact Us' },
  { id: 'privacy', label: 'Privacy Policy' },
];

export default function NavBar({ currentPage, onNavigate }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => onNavigate('home')}
          className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          🎯 Tactic9
        </button>

        <button
          className="md:hidden text-foreground text-xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>

        <ul className={`
          md:flex gap-8 list-none
          ${mobileOpen
            ? 'flex flex-col absolute top-full left-0 w-full bg-background p-6 gap-4 border-b border-border'
            : 'hidden'
          }
        `}>
          {pages.map(p => (
            <li key={p.id}>
              <button
                onClick={() => { onNavigate(p.id); setMobileOpen(false); }}
                className={`font-medium transition-colors relative
                  ${currentPage === p.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                {p.label}
                {currentPage === p.id && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
