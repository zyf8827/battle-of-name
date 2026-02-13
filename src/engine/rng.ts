import seedrandom from 'seedrandom';

import type { RNG } from './types';

// 幸运值偏置算法
// 幸运值 (LUK) 会微调随机概率，让运气好的角色更容易触发正面事件
// domain: EVENT (随机事件池) 或 COMBAT (战斗暴击/闪避)
// 使用指数衰减函数，幸运值越高，加成越高，但有上限 (Diminishing Returns)
function luckBias(domain: 'EVENT' | 'COMBAT', luk: number): number {
  const k = domain === 'EVENT' ? 60 : 120;       // 衰减常数，决定曲线陡峭程度
  const maxBias = domain === 'EVENT' ? 0.25 : 0.08; // 最大概率加成上限 (25% 或 8%)
  return maxBias * (1 - Math.exp(-Math.max(0, luk) / k));
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function createRng(seed: string): RNG {
  const raw = seedrandom(seed);
  const trace: Array<{ n: number; label: string; value: number }> = [];
  let calls = 0;

  const next = (label = 'next'): number => {
    const value = raw();
    calls += 1;
    trace.push({ n: calls, label, value });
    return value;
  };

  return {
    next,
    range(min: number, max: number, label = 'range') {
      return min + (max - min) * next(label);
    },
    bool(chance: number, luck, label = 'bool') {
      if (!Number.isFinite(chance)) {
        return false;
      }
      if (chance <= 0) {
        return false;
      }
      if (chance >= 1) {
        return true;
      }
      const bias = luck ? luckBias(luck.domain, luck.luk) : 0;
      const resultChance = clamp01(chance + bias);
      return next(label) < resultChance;
    },
    weightedPick<T>(options: T[], weights: (item: T) => number, label = 'weightedPick'): T {
      const normalized = options.map((item) => Math.max(0, weights(item)));
      const total = normalized.reduce((sum, value) => sum + value, 0);
      if (total <= 0) {
        return options[0];
      }
      const cursor = next(label) * total;
      let acc = 0;
      for (let index = 0; index < options.length; index += 1) {
        acc += normalized[index];
        if (cursor <= acc) {
          return options[index];
        }
      }
      return options[options.length - 1];
    },
    getTrace() {
      return trace;
    },
  };
}
