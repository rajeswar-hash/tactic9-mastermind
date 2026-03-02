import { GameStats } from '@/lib/gameTypes';

interface StatsCardProps {
  title: string;
  icon: string;
  stats: GameStats;
  onReset: () => void;
  compact?: boolean;
}

export default function StatsCard({ title, icon, stats, onReset, compact }: StatsCardProps) {
  const xRate = stats.totalGames ? Math.round((stats.xWins / stats.totalGames) * 100) : 0;
  const oRate = stats.totalGames ? Math.round((stats.oWins / stats.totalGames) * 100) : 0;
  const drawRate = stats.totalGames ? Math.round((stats.draws / stats.totalGames) * 100) : 0;

  return (
    <div className="bg-card rounded-2xl p-4 border border-border">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-1.5">
          {icon} {title}
        </h3>
        <button
          onClick={onReset}
          className="text-[10px] px-2 py-1 rounded-md bg-card-light text-muted-foreground hover:bg-destructive hover:text-foreground transition-all"
        >
          Reset
        </button>
      </div>
      <div className={`grid ${compact ? 'grid-cols-4' : 'grid-cols-2'} gap-2`}>
        <StatItem label="Games" value={stats.totalGames} />
        <StatItem label="X Wins" value={stats.xWins} sub={`${xRate}%`} />
        <StatItem label="O Wins" value={stats.oWins} sub={`${oRate}%`} />
        <StatItem label="Draws" value={stats.draws} sub={`${drawRate}%`} />
      </div>
    </div>
  );
}

function StatItem({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="text-center p-2 bg-background rounded-lg border border-border/50 transition-all hover:-translate-y-0.5 hover:border-primary">
      <div className="text-xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
      {sub && <div className="text-[9px] text-muted-foreground">{sub}</div>}
    </div>
  );
}
