import type { Unit } from '../engine/types';

type UnitPanelProps = {
  unit: Unit;
  winner: boolean;
};

export function UnitPanel({ unit, winner }: UnitPanelProps) {
  const hpRate = Math.max(0, Math.min(1, unit.state.hp / Math.max(1, unit.state.maxHp)));
  
  return (
    <article className={`overflow-hidden rounded-lg border p-3 transition-all ${winner ? 'border-amber-500/30 bg-amber-950/20' : 'border-slate-800 bg-slate-950/40'}`}>
      <header className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-slate-200">
          {unit.name}
          {winner && <span className="text-sm">👑</span>}
        </h3>
        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
          {unit.className ?? '无名之辈'}
        </span>
      </header>
      
      <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-slate-400">
        <span>HP {unit.state.hp} / {unit.state.maxHp}</span>
        {unit.state.shield > 0 && <span className="text-sky-400">🛡️ {unit.state.shield}</span>}
      </div>
      
      <div className="relative mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="absolute left-0 top-0 h-full bg-rose-500 transition-all" style={{ width: `${hpRate * 100}%` }} />
        {unit.state.shield > 0 && (
          <div 
            className="absolute top-0 h-full bg-sky-400/50 mix-blend-screen transition-all"
            style={{ 
              left: 0,
              width: `${Math.min(100, (unit.state.hp + unit.state.shield) / unit.state.maxHp * 100)}%` 
            }}
          />
        )}
      </div>

      <div className="grid grid-cols-4 gap-1 text-center">
        <div className="rounded bg-slate-900/50 py-1">
          <div className="text-[10px] text-slate-500">力量</div>
          <div className="font-mono text-xs font-bold text-slate-300">{unit.stats.STR}</div>
        </div>
        <div className="rounded bg-slate-900/50 py-1">
          <div className="text-[10px] text-slate-500">敏捷</div>
          <div className="font-mono text-xs font-bold text-slate-300">{unit.stats.AGI}</div>
        </div>
        <div className="rounded bg-slate-900/50 py-1">
          <div className="text-[10px] text-slate-500">体质</div>
          <div className="font-mono text-xs font-bold text-slate-300">{unit.stats.VIT}</div>
        </div>
        <div className="rounded bg-slate-900/50 py-1">
          <div className="text-[10px] text-slate-500">幸运</div>
          <div className="font-mono text-xs font-bold text-slate-300">{unit.stats.LUK}</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {unit.modifiers.length === 0 ? <span className="text-[10px] text-slate-600">无状态</span> : null}
        {unit.modifiers.map((modifier) => (
          <span key={`${unit.id}-${modifier.id}-${modifier.appliedOrder}`} className="inline-flex items-center gap-1 rounded border border-indigo-500/10 bg-indigo-500/5 px-1.5 py-0.5 text-[10px] text-indigo-300">
            {modifier.name}
            {typeof modifier.duration === 'number' && modifier.duration > 0 && (
              <span className="opacity-60">({modifier.duration})</span>
            )}
          </span>
        ))}
      </div>
    </article>
  );
}
