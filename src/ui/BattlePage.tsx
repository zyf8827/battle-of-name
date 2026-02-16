import { useEffect, useState, useRef, useCallback } from 'react';
import { useBattleStore } from '../store/battleStore';
import { BattleLog } from './BattleLog';
import { FighterPanel, type FloatingText } from './FighterPanel';

type UnitAnimState = {
  isAttacking: boolean;
  isHurt: boolean;
  isCrit: boolean;
  isMiss: boolean;
  isHealing: boolean;
  floatingTexts: FloatingText[];
};

const initialAnimState: UnitAnimState = {
  isAttacking: false,
  isHurt: false,
  isCrit: false,
  isMiss: false,
  isHealing: false,
  floatingTexts: [],
};

export function BattlePage() {
  const result = useBattleStore((state) => state.result);
  const phase = useBattleStore((state) => state.phase);
  const cursor = useBattleStore((state) => state.cursor);
  const speed = useBattleStore((state) => state.speed);
  const stepInterval = useBattleStore((state) => state.stepInterval);
  const step = useBattleStore((state) => state.step);
  const togglePause = useBattleStore((state) => state.togglePause);
  const setSpeed = useBattleStore((state) => state.setSpeed);

  const [animState1, setAnimState1] = useState<UnitAnimState>(initialAnimState);
  const [animState2, setAnimState2] = useState<UnitAnimState>(initialAnimState);

  const prevCursorRef = useRef(cursor);

  const addFloatingText = useCallback((unitId: string, text: string, type: FloatingText['type']) => {
    const id = `ft-${Date.now()}-${Math.random()}`;
    const newText: FloatingText = { id, text, type };
    
    if (unitId === 'u1') {
      setAnimState1(prev => ({ ...prev, floatingTexts: [...prev.floatingTexts, newText] }));
      setTimeout(() => {
        setAnimState1(prev => ({ ...prev, floatingTexts: prev.floatingTexts.filter(t => t.id !== id) }));
      }, 1000);
    } else if (unitId === 'u2') {
      setAnimState2(prev => ({ ...prev, floatingTexts: [...prev.floatingTexts, newText] }));
      setTimeout(() => {
        setAnimState2(prev => ({ ...prev, floatingTexts: prev.floatingTexts.filter(t => t.id !== id) }));
      }, 1000);
    }
  }, []);

  const triggerAnim = useCallback((unitId: string, key: keyof Omit<UnitAnimState, 'floatingTexts'>, duration = 400) => {
    const setter = unitId === 'u1' ? setAnimState1 : setAnimState2;
    setter(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setter(prev => ({ ...prev, [key]: false }));
    }, duration);
  }, []);

  useEffect(() => {
    if (cursor === 0) {
      setAnimState1(initialAnimState);
      setAnimState2(initialAnimState);
      prevCursorRef.current = 0;
      return;
    }

    if (cursor > prevCursorRef.current && result) {
      // 只有当前进时才触发动画
      const latestLog = result.logs[cursor - 1];
      if (latestLog) {
        const actorId = latestLog.actorId;
        const targetId = latestLog.targetId;
        const tags = latestLog.tags || [];

        // 攻击动作
        if (latestLog.eventType === 'ATTACK' && actorId) {
          triggerAnim(actorId, 'isAttacking', 200);
        }

        // 受击动作 & 飘字
        if (targetId) {
          const isMiss = latestLog.isMiss || tags.includes('miss');
          const isCrit = latestLog.isCrit || tags.includes('crit');
          const value = latestLog.value;
          
          if (latestLog.eventType === 'ATTACK') {
            if (isMiss) {
              triggerAnim(targetId, 'isMiss', 400);
              addFloatingText(targetId, 'MISS', 'miss');
            } else {
              if (isCrit) triggerAnim(targetId, 'isCrit', 500);
              triggerAnim(targetId, 'isHurt', 400);
              if (value !== undefined) {
                addFloatingText(targetId, `-${value}`, isCrit ? 'crit' : 'damage');
              }
            }
          } else if (latestLog.eventType === 'HEAL') {
            triggerAnim(targetId, 'isHealing', 500);
            if (value !== undefined) {
              addFloatingText(targetId, `+${value}`, 'heal');
            }
          } else if (latestLog.eventType === 'APPLY_BUFF' || latestLog.text.includes('获得新状态')) {
            const name = latestLog.modifierName || 'BUFF';
            addFloatingText(targetId, name, 'shield'); // 使用蓝色表示状态获得
          } else if (latestLog.eventType === 'REMOVE_BUFF' || latestLog.text.includes('状态失效')) {
            const name = latestLog.modifierName || '状态';
            addFloatingText(targetId, `${name} OFF`, 'miss');
          }
        }

        // 额外系统日志处理 (装备变更、护盾等)
        if (latestLog.text.includes('捡到装备') || latestLog.text.includes('替换了')) {
          const name = latestLog.modifierName || '装备';
          if (targetId) addFloatingText(targetId, `NEW: ${name}`, 'shield');
        }

        if (latestLog.text.includes('护盾')) {
          const value = latestLog.value;
          if (value !== undefined && targetId) {
            addFloatingText(targetId, `+${value} 🛡️`, 'shield');
          }
        }
      }
    }
    
    prevCursorRef.current = cursor;
  }, [cursor, result, triggerAnim, addFloatingText]);

  useEffect(() => {
    if (!result || phase !== 'running') return;
    const timer = window.setInterval(
      () => {
        step();
      },
      speed === 2 ? stepInterval / 2 : stepInterval,
    );
    return () => window.clearInterval(timer);
  }, [phase, result, speed, stepInterval, step]);

  if (!result) return null;

  const snapshot =
    result.snapshots[Math.min(cursor, result.snapshots.length - 1)] ??
    result.snapshots[0];
  const visibleLogs = result.logs.slice(0, cursor);

  // 判定当前是谁的回合（简单的基于最新日志判定，或者以后从 Snapshot 获取）
  const activeTurnId = result.logs[cursor]?.actorId || result.logs[cursor - 1]?.actorId;

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-4 md:p-6 max-md:gap-3 max-md:p-2 landscape:p-3 max-md:landscape:p-2 max-md:landscape:gap-2">
      <header className="sticky top-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4 backdrop-blur shadow-xl max-md:top-2 max-md:gap-2 max-md:rounded-xl max-md:p-2">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePause}
            className={`rounded-lg px-4 py-2 text-sm font-bold shadow-sm transition-all active:scale-95 max-md:px-3 max-md:py-1.5 max-md:text-xs ${
              phase === 'running'
                ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 ring-1 ring-amber-500/50'
                : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 ring-1 ring-emerald-500/50'
            }`}
          >
            {phase === 'running' ? '⏸ 暂停' : '▶ 继续'}
          </button>

          <button
            onClick={step}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 shadow-sm ring-1 ring-slate-700 transition-all hover:bg-slate-700 active:scale-95 disabled:opacity-50 max-md:px-3 max-md:py-1.5 max-md:text-xs"
            disabled={phase === 'running'}
          >
            ⏯ 单步
          </button>
        </div>

        <div className="h-6 w-px bg-slate-700/50 max-md:h-5"></div>

        <button
          onClick={() => setSpeed(speed === 1 ? 2 : 1)}
          className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 shadow-sm ring-1 ring-slate-700 transition-all hover:bg-slate-700 active:scale-95 max-md:gap-1.5 max-md:px-3 max-md:py-1.5 max-md:text-xs"
        >
          <span>速度</span>
          <span
            className={`rounded px-1.5 py-0.5 text-xs font-bold max-md:text-[10px] ${speed === 2 ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}
          >
            x{speed}
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2 rounded-lg bg-slate-950/50 px-3 py-1.5 ring-1 ring-slate-800 max-md:gap-1.5 max-md:px-2 max-md:py-1">
          <span className="text-xs text-slate-500 max-md:text-[10px]">种子</span>
          <code className="font-mono text-sm font-bold text-slate-300 max-md:text-xs">
            {result.seed}
          </code>
        </div>
      </header>

      <div className="grid flex-1 gap-4 md:gap-6 landscape:gap-3 lg:grid-cols-[1fr_1.4fr_1fr] landscape:grid-cols-[1fr_1.2fr_1fr] md:grid-cols-1 items-start max-md:gap-2 max-md:landscape:gap-2">
        <div className="lg:sticky lg:top-24 md:static max-md:landscape:max-h-[calc(100dvh-8.5rem)] max-md:landscape:overflow-y-auto max-md:landscape:pr-1">
          <FighterPanel
            unit={snapshot.units[0]}
            side="left"
            envModifiers={snapshot.envModifiers}
            isActiveTurn={activeTurnId === snapshot.units[0].id}
            {...animState1}
          />
        </div>

        <BattleLog logs={visibleLogs} title="⚔️ 实时战报" />

        <div className="lg:sticky lg:top-24 md:static max-md:landscape:max-h-[calc(100dvh-8.5rem)] max-md:landscape:overflow-y-auto max-md:landscape:pl-1">
          <FighterPanel
            unit={snapshot.units[1]}
            side="right"
            envModifiers={snapshot.envModifiers}
            isActiveTurn={activeTurnId === snapshot.units[1].id}
            {...animState2}
          />
        </div>
      </div>
    </section>
  );
}
