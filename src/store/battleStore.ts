/**
 * 战斗状态管理 (Zustand)
 *
 * 使用 Zustand 管理整个战斗的状态，包括：
 * - 输入状态（姓名、种子）
 * - 战斗结果（日志、快照）
 * - 播放控制（cursor、speed、phase）
 *
 * === 状态结构 ===
 *
 * **输入**：
 * - nameA, nameB: 双方姓名
 * - seed: 战斗种子
 *
 * **输出**：
 * - result: 战斗结果（BattleOutcome）
 *
 * **播放控制**：
 * - cursor: 当前播放位置（指向 logs 数组）
 * - speed: 播放速度（1=正常, 2=倍速）
 * - phase: 战斗阶段
 *   - idle: 未开始
 *   - running: 播放中
 *   - paused: 已暂停
 *   - finished: 已结束
 *
 * === 使用示例 ===
 *
 * ```typescript
 * const { nameA, nameB, result, startBattle, step } = useBattleStore();
 *
 * // 设置姓名
 * setNameA('张三');
 * setNameB('李四');
 *
 * // 开始战斗
 * startBattle();
 *
 * // 单步播放
 * step();
 * ```
 */

import { create } from 'zustand';

import { defaultBattleContentAdapter } from '../content';
import { runBattle } from '../engine/engine';
import type { BattleOutcome } from '../engine/types';

/**
 * 战斗阶段
 *
 * 定义战斗播放机的生命周期状态：
 * - idle: 初始状态，等待用户输入姓名
 * - running: 战斗正在进行（自动播放中）
 * - paused: 战斗暂停（用户手动暂停）
 * - finished: 战斗结束（显示结果）
 */
type BattlePhase = 'idle' | 'running' | 'paused' | 'finished';

/**
 * 战斗 Store 接口
 *
 * 定义所有状态字段和操作方法。
 */
type BattleStore = {
  // === 输入状态 ===
  nameA: string;              // 玩家 A 姓名
  nameB: string;              // 玩家 B 姓名
  seed: string;               // 战斗种子

  // === 战斗结果 ===
  result: BattleOutcome | null;  // 战斗结果（完成后非 null）

  // === 播放控制 ===
  cursor: number;              // 当前播放位置（logs 数组索引）
  speed: 1 | 2;              // 播放速度（1=正常, 2=倍速）
  phase: BattlePhase;          // 当前阶段

  // === 操作方法 ===
  setNameA: (value: string) => void;           // 设置玩家 A 姓名
  setNameB: (value: string) => void;           // 设置玩家 B 姓名
  startBattle: (seedOverride?: string) => void;  // 开始战斗（可选覆盖种子）
  togglePause: () => void;                       // 切换暂停/播放
  step: () => void;                               // 单步前进
  setSpeed: (speed: 1 | 2) => void;            // 设置播放速度
  reset: () => void;                              // 重置战斗
};

/**
 * 战斗计数器
 *
 * 用于确保同一时间创建的种子有不同的后缀。
 * 每次调用 `createBattleSeed` 时递增。
 */
let battleCounter = 0;

/**
 * 种子字符集
 *
 * 种子使用的字符：数字 + 小写字母 + 大写字母（62 个字符）
 */
const SEED_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * 默认种子长度
 *
 * 自动生成的种子使用 8 个字符。
 */
const DEFAULT_SEED_LENGTH = 8;

/**
 * 从数值数组创建种子字符串
 *
 * **逻辑**：
 * 1. 遍历输入的数值数组
 * 2. 对每个数值取模（模字符集长度）
 * 3. 使用结果作为索引，从字符集取字符
 * 4. 如果数值用完但长度不够，使用 fallback 算法生成剩余字符
 *
 * **Fallback 算法**：
 * - 结合当前时间戳、battleCounter、当前长度
 * - 确保即使是 fallback 也是确定性的（相对固定输入）
 *
 * @param values - 数值数组
 * @param length - 目标种子长度
 * @returns 种子字符串
 */
function createSeedFromNumbers(values: number[], length: number): string {
  let seed = '';

  // 主循环：使用输入的数值
  for (let index = 0; index < values.length && seed.length < length; index += 1) {
    seed += SEED_ALPHABET[values[index] % SEED_ALPHABET.length];
  }

  // Fallback 循环：如果数值用完但长度不够
  while (seed.length < length) {
    const fallbackValue = (Date.now() + battleCounter + seed.length * 17) % SEED_ALPHABET.length;
    seed += SEED_ALPHABET[fallbackValue];
  }

  return seed;
}

/**
 * 创建战斗种子
 *
 * **策略**：
 * 1. 优先使用浏览器 Crypto API（真随机）
 *    - 检测 `crypto.getRandomValues`
 *    - 生成 8 个随机 32 位整数
 *    - 转换为种子字符串
 *
 * 2. Fallback：使用确定性算法
 *    - 基于 nameA + nameB + 时间戳 + battleCounter
 *    - 字符 ASCII 码 + 索引偏移（13）
 *    - 转换为种子字符串
 *
 * **确定性**：
 * - 相同的 nameA + nameB 在相同时间调用会生成相同种子（fallback 模式）
 * - 不同时间调用会生成不同种子（时间戳不同）
 * - battleCounter 确保连续调用不会重复
 *
 * @param nameA - 玩家 A 姓名
 * @param nameB - 玩家 B 姓名
 * @returns 8 字符种子字符串
 *
 * 示例：
 * - createBattleSeed('张三', '李四') → 'a7B3k9L1'
 * - createBattleSeed('张三', '李四') → 'x2M8p4Q5' (不同时间，不同结果）
 */
function createBattleSeed(nameA: string, nameB: string): string {
  // 递增计数器（确保唯一性）
  battleCounter += 1;

  // 策略 1: 使用 Crypto API（如果可用）
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const values = new Uint32Array(DEFAULT_SEED_LENGTH);
    crypto.getRandomValues(values);
    return createSeedFromNumbers(Array.from(values), DEFAULT_SEED_LENGTH);
  }

  // 策略 2: Fallback 确定性算法
  const fallbackBase = `${nameA.trim()}|${nameB.trim()}|${Date.now()}|${battleCounter}`;
  const values = Array.from(fallbackBase).map((char, index) => char.charCodeAt(0) + index * 13);
  return createSeedFromNumbers(values, DEFAULT_SEED_LENGTH);
}

/**
 * 战斗 Store 实例
 *
 * 创建 Zustand store，导出为 `useBattleStore` Hook。
 *
 * === 初始状态 ===
 *
 * ```typescript
 * {
 *   nameA: '',           // 空姓名
 *   nameB: '',           // 空姓名
 *   seed: '',            // 空种子
 *   result: null,        // 无结果
 *   cursor: 0,           // 起始位置
 *   speed: 1,            // 正常速度
 *   phase: 'idle',       // 空闲状态
 * }
 * ```
 *
 * === 操作方法 ===
 */
export const useBattleStore = create<BattleStore>((set, get) => ({
  // === 初始状态 ===
  nameA: '',
  nameB: '',
  seed: '',
  result: null,
  cursor: 0,
  speed: 1,
  phase: 'idle',

  // === 操作方法实现 ===

  /**
   * 设置玩家 A 姓名
   *
   * @param value - 新姓名
   */
  setNameA: (value) => set({ nameA: value }),

  /**
   * 设置玩家 B 姓名
   *
   * @param value - 新姓名
   */
  setNameB: (value) => set({ nameB: value }),

  /**
   * 开始战斗
   *
   * **流程**：
   * 1. 获取当前姓名（nameA, nameB）
   * 2. 规范化输入（trim 去除空格）
   * 3. 验证输入（双方姓名非空）
   * 4. 生成或使用覆盖种子
   * 5. 调用引擎 `runBattle`
   * 6. 更新状态：
   *    - result: 战斗结果
   *    - seed: 实际使用的种子
   *    - cursor: 重置为 0
   *    - phase: 切换到 'running'
   *
   * @param seedOverride - 可选的种子覆盖（用于重放）
   */
  startBattle: (seedOverride) => {
    const { nameA, nameB } = get();
    const normalizedNameA = nameA.trim();
    const normalizedNameB = nameB.trim();

    // 验证输入
    if (!normalizedNameA || !normalizedNameB) {
      return;
    }

    // 生成或使用覆盖种子
    const normalizedSeed = seedOverride?.trim() || createBattleSeed(normalizedNameA, normalizedNameB);

    // 执行战斗
    const result = runBattle(
      {
        name1: normalizedNameA,
        name2: normalizedNameB,
        seed: normalizedSeed,
      },
      defaultBattleContentAdapter,
    );

    // 更新状态
    set({ result, seed: normalizedSeed, cursor: 0, phase: 'running' });
  },

  /**
   * 切换暂停/播放
   *
   * **逻辑**：
   * - 如果当前是 'running' → 切换到 'paused'
   * - 如果当前是 'paused' → 切换到 'running'
   * - 如果是 'finished' 或 'idle' → 忽略（无效操作）
   */
  togglePause: () => {
    const { phase } = get();
    if (phase === 'finished' || phase === 'idle') return;
    set({ phase: phase === 'running' ? 'paused' : 'running' });
  },

  /**
   * 单步前进
   *
   * **逻辑**：
   * 1. 检查 result 是否存在
   * 2. 计算 next = min(cursor + 1, logs.length)
   * 3. 判断新阶段：
   *    - 如果 next >= logs.length → 'finished'
   *    - 如果当前是 'idle' → 'paused'（暂停等待）
   *    - 否则保持当前阶段
   * 4. 更新 cursor 和 phase
   *
   * **边界情况**：
   * - result 为 null → 不操作
   * - cursor 已到最后 → 不增加
   */
  step: () => {
    const { result, cursor, phase } = get();
    if (!result) return;

    const next = Math.min(cursor + 1, result.logs.length);
    const nextPhase = next >= result.logs.length ? 'finished' : phase === 'idle' ? 'paused' : phase;

    set({ cursor: next, phase: nextPhase });
  },

  /**
   * 设置播放速度
   *
   * @param speed - 新速度（1=正常, 2=倍速）
   */
  setSpeed: (speed) => set({ speed }),

  /**
   * 重置战斗
   *
   * 清除结果，重置播放位置，回到空闲状态。
   * 保留姓名输入（nameA, nameB）
   */
  reset: () => set({ result: null, cursor: 0, phase: 'idle' }),
}));
