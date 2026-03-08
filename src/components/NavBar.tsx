import { useState } from 'react';

interface NavBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onMenuToggle?: (open: boolean) => void;
}

const pages = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'howto', label: 'How to Play' },
  { id: 'strategy', label: 'Strategy Guide' },
  { id: 'help', label: 'Help' },
  { id: 'contact', label: 'Contact Us' },
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'privacy', label: 'Privacy Policy' },
];

export default function NavBar({ currentPage, onNavigate, onMenuToggle }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = (open: boolean) => {
    setMobileOpen(open);
    onMenuToggle?.(open);
  };

  return (
    <>
      {/* Full-screen overlay behind menu - blocks all interaction and blurs content */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() => toggleMenu(false)}
        />
      )}

      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => { onNavigate('home'); toggleMenu(false); }}
            className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            🎯 Tactic9
          </button>

          <button
            className="md:hidden text-foreground text-xl relative z-50"
            onClick={() => toggleMenu(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>

          <ul className={`
            md:flex gap-8 list-none
            ${mobileOpen
              ? 'flex flex-col absolute top-full left-0 w-full bg-background p-6 gap-4 border-b border-border z-50'
              : 'hidden'
            }
          `}>
            {pages.map(p => (
              <li key={p.id}>
                <button
                  onClick={() => { onNavigate(p.id); toggleMenu(false); }}
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
    </>
  );
}
