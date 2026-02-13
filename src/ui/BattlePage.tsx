import { useEffect } from 'react';

import { useBattleStore } from '../store/battleStore';
import { BattleLog } from './BattleLog';
import { FighterPanel } from './FighterPanel';

export function BattlePage() {
  const result = useBattleStore((state) => state.result);
  const phase = useBattleStore((state) => state.phase);
  const cursor = useBattleStore((state) => state.cursor);
  const speed = useBattleStore((state) => state.speed);
  const step = useBattleStore((state) => state.step);
  const togglePause = useBattleStore((state) => state.togglePause);
  const setSpeed = useBattleStore((state) => state.setSpeed);

  useEffect(() => {
    if (!result || phase !== 'running') return;
    const timer = window.setInterval(() => {
      step();
    }, speed === 2 ? 250 : 500);
    return () => window.clearInterval(timer);
  }, [phase, result, speed, step]);

  if (!result) return null;

  const snapshot = result.snapshots[Math.min(cursor, result.snapshots.length - 1)] ?? result.snapshots[0];
  const visibleLogs = result.logs.slice(0, cursor);

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <header className="sticky top-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4 backdrop-blur shadow-xl">
        <div className="flex items-center gap-2">
          <button 
            onClick={togglePause} 
            className={`rounded-lg px-4 py-2 text-sm font-bold shadow-sm transition-all active:scale-95 ${
              phase === 'running' 
                ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 ring-1 ring-amber-500/50' 
                : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 ring-1 ring-emerald-500/50'
            }`}
          >
            {phase === 'running' ? '⏸ 暂停' : '▶ 继续'}
          </button>
          
          <button 
            onClick={step} 
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 shadow-sm ring-1 ring-slate-700 transition-all hover:bg-slate-700 active:scale-95 disabled:opacity-50"
            disabled={phase === 'running'}
          >
            ⏯ 单步
          </button>
        </div>

        <div className="h-6 w-px bg-slate-700/50"></div>

        <button 
          onClick={() => setSpeed(speed === 1 ? 2 : 1)} 
          className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 shadow-sm ring-1 ring-slate-700 transition-all hover:bg-slate-700 active:scale-95"
        >
          <span>速度</span>
          <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${speed === 2 ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
            x{speed}
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2 rounded-lg bg-slate-950/50 px-3 py-1.5 ring-1 ring-slate-800">
          <span className="text-xs text-slate-500">种子</span>
          <code className="font-mono text-sm font-bold text-slate-300">{result.seed}</code>
        </div>
      </header>

      <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_1.4fr_1fr] items-start">
        <div className="sticky top-24">
          <FighterPanel unit={snapshot.units[0]} />
        </div>
        
        <BattleLog logs={visibleLogs} title="⚔️ 实时战报" />
        
        <div className="sticky top-24">
          <FighterPanel unit={snapshot.units[1]} />
        </div>
      </div>
    </section>
  );
}
