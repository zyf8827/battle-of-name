import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getClassById } from '../content/classes';
import { getConsumableById } from '../content/consumables';
import { getEquipmentById } from '../content/equipment';
import type { Modifier, Unit } from '../engine/types';
import { Tooltip } from './Tooltip';

export type FloatingText = {
  id: string;
  text: string;
  type: 'damage' | 'crit' | 'heal' | 'shield' | 'miss';
};

type FighterPanelProps = {
  unit: Unit;
  side: 'left' | 'right';
  winner?: boolean;
  totalDamage?: number;
  envModifiers?: Modifier[];
  isAttacking?: boolean;
  isHurt?: boolean;
  isCrit?: boolean;
  isMiss?: boolean;
  isHealing?: boolean;
  isActiveTurn?: boolean;
  floatingTexts?: FloatingText[];
};

export function FighterPanel({
  unit,
  side,
  winner,
  totalDamage,
  envModifiers = [],
  isAttacking = false,
  isHurt = false,
  isCrit = false,
  isMiss = false,
  isHealing = false,
  isActiveTurn = false,
  floatingTexts = [],
}: FighterPanelProps) {
  const [prevHp, setPrevHp] = useState(unit.state.hp);
  const [displayHp, setDisplayHp] = useState(unit.state.hp);
  
  const hpRate = Math.max(
    0,
    Math.min(1, unit.state.hp / Math.max(1, unit.state.maxHp)),
  );

  const prevHpRate = Math.max(
    0,
    Math.min(1, prevHp / Math.max(1, unit.state.maxHp)),
  );

  useEffect(() => {
    if (unit.state.hp !== displayHp) {
      setPrevHp(displayHp);
      setDisplayHp(unit.state.hp);
    }
  }, [unit.state.hp, displayHp]);

  const equipmentModifiers = unit.modifiers.filter((m) => m.source === 'EQUIP');

  // 合并所有非装备修饰器，并按 ID 去重合并
  const allOtherModifiers = [
    ...unit.modifiers.filter((m) => m.source !== 'EQUIP'),
    ...envModifiers,
  ];
  const otherModifiers = Array.from(
    allOtherModifiers
      .reduce((acc, modifier) => {
        const existing = acc.get(modifier.id);
        if (existing) {
          // 相同 ID 的修饰器，合并层数和持续时间
          const stacks = (existing.stacks ?? 1) + (modifier.stacks ?? 1);
          const duration = modifier.duration ?? existing.duration;
          acc.set(modifier.id, {
            ...existing,
            stacks,
            duration: Math.max(existing.duration ?? 0, duration ?? 0),
          });
        } else {
          acc.set(modifier.id, { ...modifier, stacks: modifier.stacks ?? 1 });
        }
        return acc;
      }, new Map<string, Modifier>())
      .values(),
  );

  let characterClass;
  try {
    characterClass = unit.classId ? getClassById(unit.classId) : undefined;
  } catch {
    // ignore
  }

  const isDead = unit.state.hp <= 0;

  // 动画变体定义
  const variants: Variants = {
    idle: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      filter: isDead ? 'grayscale(1) opacity(0.6)' : 'grayscale(0) opacity(1)',
    },
    attacking: {
      x: side === 'left' ? 40 : -40,
      rotate: side === 'left' ? 5 : -5,
      transition: { duration: 0.1, type: 'spring', stiffness: 500 },
    },
    hurt: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    },
    critHurt: {
      x: [0, -20, 20, -20, 20, 0],
      scale: [1, 0.9, 1.1, 1],
      transition: { duration: 0.5 },
    },
    miss: {
      x: side === 'left' ? -20 : 20,
      y: -10,
      opacity: 0.8,
      transition: { duration: 0.2 },
    },
    healing: {
      y: [0, -10, 0],
      transition: { duration: 0.5 },
    }
  };

  const currentAnimation = isAttacking 
    ? 'attacking' 
    : isCrit && isHurt 
      ? 'critHurt' 
      : isHurt 
        ? 'hurt' 
        : isMiss 
          ? 'miss' 
          : isHealing 
            ? 'healing' 
            : 'idle';

  return (
    <motion.article
      animate={currentAnimation}
      variants={variants}
      initial="idle"
      className={`relative rounded-xl border p-3 transition-shadow duration-300 sm:p-4 ${
        winner 
          ? 'border-amber-500/50 bg-amber-950/20 shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]' 
          : isActiveTurn
            ? 'border-indigo-500/50 bg-slate-900/90 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] ring-2 ring-indigo-500/20'
            : 'border-slate-700 bg-slate-900/80 shadow-lg'
      }`}
    >
      {/* 飘字系统 */}
      <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-visible">
        <AnimatePresence>
          {floatingTexts.map((ft) => (
            <motion.div
              key={ft.id}
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                y: ft.type === 'heal' || ft.type === 'shield' ? -100 : 60,
                scale: ft.type === 'crit' ? [0.5, 1.5, 1.2] : [0.5, 1, 1],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, times: [0, 0.1, 0.8, 1] }}
              className={`absolute text-xl font-black italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-2xl ${
                ft.type === 'damage' ? 'text-rose-500' :
                ft.type === 'crit' ? 'text-yellow-400 text-2xl sm:text-3xl' :
                ft.type === 'heal' ? 'text-emerald-400' :
                ft.type === 'shield' ? 'text-sky-400' :
                'text-slate-400'
              }`}
            >
              {ft.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 受击红光闪烁 */}
      <AnimatePresence>
        {isHurt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-0 rounded-xl bg-rose-500/30 z-10"
          />
        )}
      </AnimatePresence>

      <header className="mb-3 flex items-start justify-between sm:mb-4">
        <div>
          <h3 className="flex items-center gap-1.5 text-lg font-black tracking-wide text-slate-100 sm:gap-2 sm:text-xl">
            {unit.name}
            {winner && <span className="text-xl">👑</span>}
          </h3>
          <Tooltip
            content={
              characterClass ? (
                <div>
                  <div className="font-bold text-slate-200">
                    {characterClass.name}
                  </div>
                  <div className="mt-1 text-slate-400">
                    {characterClass.description}
                  </div>
                  {characterClass.talents &&
                    characterClass.talents.length > 0 && (
                      <div className="mt-1 text-sky-400 text-[10px]">
                        {characterClass.talents.map((t) => (
                          <div key={t.id}>被动: {t.name}</div>
                        ))}
                      </div>
                    )}
                </div>
              ) : (
                '无职业'
              )
            }
          >
            <p className="cursor-help text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors sm:text-xs">
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
              {unit.className ?? '无名之辈'}
            </p>
          </Tooltip>
        </div>
        {winner && (
          <span className="absolute -right-4 top-4 rotate-45 bg-amber-500 px-8 py-1 text-xs font-bold text-slate-900 shadow-sm">
            WINNER
          </span>
        )}
      </header>

      {/* HP Bar */}
      <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-300">
        <span className="flex items-center gap-1 text-[11px] text-rose-400 sm:text-xs">
          <span className="text-[10px]">❤️</span> {unit.state.hp}{' '}
          <span className="text-slate-500">/ {unit.state.maxHp}</span>
        </span>
        {unit.state.shield > 0 && (
          <span className="flex items-center gap-1 rounded bg-sky-500/20 px-1.5 py-0.5 text-[11px] font-bold text-sky-300 ring-1 ring-sky-500/40 sm:px-2 sm:text-xs">
            🛡️ {unit.state.shield}
          </span>
        )}
      </div>
      <div className="relative mb-3.5 h-2.5 overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700/50 sm:mb-5 sm:h-3">
        {/* Ghost HP bar (background slow catching up) */}
        <div
          className="absolute left-0 top-0 h-full bg-rose-900/50 transition-all duration-1000 ease-out"
          style={{ width: `${Math.max(hpRate, prevHpRate) * 100}%` }}
        />
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-500 ease-out z-10"
          style={{ width: `${hpRate * 100}%` }}
        />
        {unit.state.shield > 0 && (
          <div
            className="absolute top-0 h-full bg-sky-400/50 mix-blend-screen transition-all duration-500 z-20"
            style={{
              left: 0,
              width: `${Math.min(100, ((unit.state.hp + unit.state.shield) / unit.state.maxHp) * 100)}%`,
            }}
          />
        )}
      </div>

      {/* Stats Grid */}
      <div className="mb-3.5 grid grid-cols-2 gap-2 rounded-lg bg-slate-950/30 p-2.5 sm:mb-5 sm:gap-3 sm:p-3">
        <Tooltip content="决定物理攻击伤害 (STR)">
          <div className="flex cursor-help items-center gap-2 hover:bg-slate-800/50 rounded transition-colors p-1 max-md:gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-rose-500/10 text-base sm:h-8 sm:w-8 sm:text-lg">
              💪
            </div>
            <div>
              <div className="text-[10px] text-slate-500">力量 (STR)</div>
              <div className="font-mono text-xs font-bold text-slate-200 sm:text-sm">
                {unit.stats.STR}
              </div>
            </div>
          </div>
        </Tooltip>
        <Tooltip content="决定出手速度和闪避率 (AGI)">
          <div className="flex cursor-help items-center gap-2 hover:bg-slate-800/50 rounded transition-colors p-1 max-md:gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500/10 text-base sm:h-8 sm:w-8 sm:text-lg">
              🦶
            </div>
            <div>
              <div className="text-[10px] text-slate-500">敏捷 (AGI)</div>
              <div className="font-mono text-xs font-bold text-slate-200 sm:text-sm">
                {unit.stats.AGI}
              </div>
            </div>
          </div>
        </Tooltip>
        <Tooltip content="决定最大生命值 (VIT)">
          <div className="flex cursor-help items-center gap-2 hover:bg-slate-800/50 rounded transition-colors p-1 max-md:gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-amber-500/10 text-base sm:h-8 sm:w-8 sm:text-lg">
              ❤️
            </div>
            <div>
              <div className="text-[10px] text-slate-500">体质 (VIT)</div>
              <div className="font-mono text-xs font-bold text-slate-200 sm:text-sm">
                {unit.stats.VIT}
              </div>
            </div>
          </div>
        </Tooltip>
        <Tooltip content="决定暴击率和随机事件好运度 (LUK)">
          <div className="flex cursor-help items-center gap-2 hover:bg-slate-800/50 rounded transition-colors p-1 max-md:gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-purple-500/10 text-base sm:h-8 sm:w-8 sm:text-lg">
              🍀
            </div>
            <div>
              <div className="text-[10px] text-slate-500">幸运 (LUK)</div>
              <div className="font-mono text-xs font-bold text-slate-200 sm:text-sm">
                {unit.stats.LUK}
              </div>
            </div>
          </div>
        </Tooltip>
      </div>

      <div className="space-y-2.5 sm:space-y-4">
        {/* Equipment */}
        <div>
          <p className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-slate-400 sm:mb-2 sm:text-xs">
            <span className="inline-block h-1 w-1 rounded-full bg-slate-500"></span>{' '}
            装备
          </p>
          <div className="flex flex-wrap gap-1.5 max-md:gap-1">
            {equipmentModifiers.length === 0 ? (
              <span className="text-[11px] italic text-slate-600 sm:text-xs">无</span>
            ) : null}
            {equipmentModifiers.map((modifier) => {
              const equipDef = getEquipmentById(modifier.id);
              const rarityMap: Record<string, string> = {
                COMMON: '普通',
                RARE: '稀有',
                EPIC: '史诗',
                LEGENDARY: '传说',
              };
              const slotMap: Record<string, string> = {
                WEAPON: '武器',
                ARMOR: '防具',
                ACCESSORY: '饰品',
              };

              return (
                <Tooltip
                  key={`${unit.id}-equip-${modifier.id}-${modifier.appliedOrder}`}
                  content={
                    <div>
                      <div className="font-bold text-amber-300">
                        {modifier.name}
                      </div>
                      {equipDef?.description && (
                        <div className="mt-1 text-slate-300">
                          {equipDef.description}
                        </div>
                      )}
                      {equipDef && (
                        <div className="mt-1 text-[10px] text-slate-500 uppercase">
                          {rarityMap[equipDef.rarity] ?? equipDef.rarity} ·{' '}
                          {slotMap[equipDef.slot] ?? equipDef.slot}
                        </div>
                      )}
                    </div>
                  }
                >
                  <span className="inline-flex cursor-help items-center gap-1 rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[11px] text-amber-300 transition hover:bg-amber-500/20 hover:text-amber-200 sm:px-2 sm:py-1 sm:text-xs">
                    {modifier.name}
                  </span>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Status Effects */}
        <div>
          <p className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-slate-400 sm:mb-2 sm:text-xs">
            <span className="inline-block h-1 w-1 rounded-full bg-slate-500"></span>{' '}
            状态效果
          </p>
          <div className="flex flex-wrap gap-1.5 max-md:gap-1">
            {otherModifiers.length === 0 ? (
              <span className="text-[11px] italic text-slate-600 sm:text-xs">无</span>
            ) : null}
            {otherModifiers.map((modifier) => (
              <Tooltip
                key={`${unit.id}-${modifier.id}-${modifier.appliedOrder}`}
                content={
                  <div>
                    <div className="font-bold text-indigo-300">
                      {modifier.name}
                    </div>
                    {modifier.description && (
                      <div className="mt-1 text-slate-300">
                        {modifier.description}
                      </div>
                    )}
                    <div className="mt-1 text-[10px] text-slate-500">
                      持续: {modifier.duration ?? '无限'} | 层数:{' '}
                      {modifier.stacks ?? 1}
                    </div>
                  </div>
                }
              >
                <span className="inline-flex cursor-help items-center gap-1 rounded border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 text-[11px] text-indigo-300 transition hover:bg-indigo-500/20 hover:text-indigo-200 sm:px-2 sm:text-xs">
                  {modifier.name}
                  {(modifier.stacks ?? 1) > 1 && (
                    <span className="rounded bg-indigo-500/20 px-1 text-[10px] text-indigo-200">
                      x{modifier.stacks}
                    </span>
                  )}
                  {typeof modifier.duration === 'number' &&
                    modifier.duration > 0 && (
                      <span className="rounded bg-indigo-500/20 px-1 text-[10px] text-indigo-200">
                        {modifier.duration}
                      </span>
                    )}
                </span>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Consumables */}
        <div>
          <p className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-slate-400 sm:mb-2 sm:text-xs">
            <span className="inline-block h-1 w-1 rounded-full bg-slate-500"></span>{' '}
            持有物品
          </p>
          <div className="flex flex-wrap gap-1.5 max-md:gap-1">
            {(unit.state.consumables ?? []).length === 0 ? (
              <span className="text-[11px] italic text-slate-600 sm:text-xs">无</span>
            ) : null}
            {(unit.state.consumables ?? []).map((itemId, idx) => {
              const itemDef = getConsumableById(itemId);
              return (
                <Tooltip
                  key={`${unit.id}-item-${itemId}-${idx}`}
                  content={
                    itemDef ? (
                      <div>
                        <div className="font-bold text-emerald-300">
                          {itemDef.name}
                        </div>
                        <div className="mt-1 text-slate-300">
                          {itemDef.description}
                        </div>
                      </div>
                    ) : (
                      <div className="text-rose-400">
                        Unknown Item: {itemId}
                      </div>
                    )
                  }
                >
                  <span className="cursor-help rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[11px] text-emerald-300 transition hover:bg-emerald-500/20 hover:text-emerald-200 sm:px-2 sm:text-xs">
                    {itemDef?.name ?? itemId}
                  </span>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>

      {typeof totalDamage === 'number' && (
        <div className="mt-3 border-t border-slate-700/50 pt-2 text-center sm:mt-4 sm:pt-3">
          <p className="text-[11px] text-slate-400 sm:text-xs">
            本场总输出{' '}
            <span className="font-mono text-xs font-bold text-rose-400 sm:text-sm">
              {totalDamage}
            </span>
          </p>
        </div>
      )}
    </motion.article>
  );
}
