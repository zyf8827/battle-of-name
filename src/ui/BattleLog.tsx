import { useEffect, useMemo, useRef } from 'react';

import type { LogEntry } from '../engine/types';

type BattleLogProps = {
  logs: LogEntry[];
  title?: string;
};

function stripDuplicatedActorPrefix(text: string, actorName?: string): string {
  if (!actorName) return text;
  const trimmed = text.trimStart();
  if (!trimmed.startsWith(actorName)) return text;

  const nextChar = trimmed.slice(actorName.length, actorName.length + 1);
  if (nextChar && !/[\s,，。.!！？:：;；、\-]/.test(nextChar)) {
    return text;
  }

  const stripped = trimmed
    .slice(actorName.length)
    .replace(/^[\s,，:：;；、\-]+/, '');
  return stripped || text;
}

export function BattleLog({ logs, title = '战斗日志' }: BattleLogProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [logs.length]);

  const grouped = useMemo(() => {
    const bucket = new Map<number, LogEntry[]>();
    for (const log of logs) {
      const arr = bucket.get(log.round) ?? [];
      arr.push(log);
      bucket.set(log.round, arr);
    }
    return [...bucket.entries()].sort((a, b) => a[0] - b[0]);
  }, [logs]);

  return (
    <section className="flex h-[72vh] flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900/90 shadow-2xl backdrop-blur-sm">
      <div className="border-b border-slate-700/50 bg-slate-800/30 px-4 py-3">
        <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-200 uppercase">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          {title}
        </h3>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scroll-smooth px-4 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700"
      >
        <div className="space-y-6">
          {grouped.map(([round, roundLogs]) => (
            <div
              key={`round-${round}`}
              className="relative pl-4 before:absolute before:bottom-0 before:left-0 before:top-0 before:w-0.5 before:bg-slate-800"
            >
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-sky-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/10 text-[10px] ring-1 ring-sky-500/30">
                  R
                </span>
                <span>第 {round} 回合</span>
              </div>
              <ul className="space-y-2.5">
                {roundLogs.map((log) => (
                  <li
                    key={`${log.seq}-${log.eventId ?? 'none'}`}
                    className="group relative flex items-start gap-3 rounded-lg p-1.5 transition-colors hover:bg-slate-800/30"
                  >
                    <span className="mt-0.5 flex h-5 min-w-[2rem] items-center justify-center rounded bg-slate-800 px-1.5 font-mono text-[10px] font-bold text-slate-500 ring-1 ring-slate-700">
                      T{log.turn}
                    </span>
                    <span className="min-w-0 flex-1 text-sm leading-relaxed text-slate-300">
                      {log.actorName && (
                        <span className="mr-1.5 inline-block font-bold text-amber-400">
                          {log.actorName}
                        </span>
                      )}
                      <span
                        className={
                          log.actorName
                            ? 'text-slate-300'
                            : 'text-slate-400 italic'
                        }
                      >
                        {stripDuplicatedActorPrefix(log.text, log.actorName)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center py-20 opacity-50">
              <div className="text-4xl">⚔️</div>
              <p className="mt-2 text-sm text-slate-500">等待战斗开始...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
