import confetti from 'canvas-confetti';
import { useEffect } from 'react';

import { useBattleStore } from '../store/battleStore';
import { BattleLog } from './BattleLog';
import { FighterPanel } from './FighterPanel';

export function ResultPage() {
  const result = useBattleStore((state) => state.result);
  const reset = useBattleStore((state) => state.reset);

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#34d399', '#f59e0b', '#3b82f6', '#ec4899'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#34d399', '#f59e0b', '#3b82f6', '#ec4899'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  if (!result) return null;

  const finalSnapshot =
    result.snapshots[result.snapshots.length - 1] ?? result.snapshots[0];
  const winnerId = result.winnerId;
  const winner = finalSnapshot.units.find((unit) => unit.id === winnerId);

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 p-6 md:p-8">
      <header className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 to-slate-900/80 p-8 shadow-2xl backdrop-blur-sm">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="relative z-10 text-center">
          <h2 className="mb-2 text-3xl font-black tracking-widest text-emerald-400 drop-shadow-sm">
            🏆 战斗结算
          </h2>
          <div className="mt-4 flex flex-col items-center justify-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wide text-emerald-600/80">
              Winner
            </span>
            <span className="text-5xl font-black text-white drop-shadow-lg">
              {winner?.name ?? winnerId}
            </span>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs font-medium text-slate-400">
            <span className="rounded-full bg-slate-800/50 px-3 py-1 ring-1 ring-slate-700">
              总回合: {result.summary.totalRounds}
            </span>
            <span className="rounded-full bg-slate-800/50 px-3 py-1 ring-1 ring-slate-700">
              种子: {result.seed}
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {finalSnapshot.units.map((unit) => (
          <FighterPanel
            key={`result-${unit.id}`}
            unit={unit}
            winner={unit.id === winnerId}
            totalDamage={result.summary.totalDamageByUnit[unit.id] ?? 0}
            envModifiers={finalSnapshot.envModifiers}
          />
        ))}
      </div>

      <BattleLog logs={result.logs} title="📜 完整战报回放" />

      <div className="sticky bottom-6 z-20 flex justify-center pb-4">
        <button
          onClick={reset}
          className="group relative overflow-hidden rounded-xl bg-sky-500 px-8 py-3 text-lg font-bold text-white shadow-lg shadow-sky-500/30 transition-all hover:-translate-y-0.5 hover:shadow-sky-500/50 active:translate-y-0 active:scale-95"
        >
          <span className="relative z-10">🔄 重开一局</span>
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-sky-600 to-sky-400 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </button>
      </div>
    </section>
  );
}
