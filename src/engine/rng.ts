/**
 * 基于种子的随机数生成器
 *
 * 使用 `seedrandom` 库实现确定性随机：
 * - 相同的 seed → 相同的随机数序列
 * - 所有的 RNG 调用都会被追踪（用于回放）
 * - 支持幸运值加成（LUK 属性影响随机结果）
 *
 * === 确定性保证 ===
 *
 * 1. **种子隔离**：每个战斗使用独立的 seed
 * 2. **调用追踪**：每次调用记录序号、标签、返回值
 * 3. **幸运系统**：LUK 属性提供概率加成，但不破坏确定性
 *
 * === API ===
 *
 * - `next(label?)`: 生成 [0, 1) 随机数
 * - `range(min, max, label?)`: 生成 [min, max] 随机整数
 * - `bool(chance, luck?, label?)`: 概率判定（支持幸运加成）
 * - `weightedPick(options, weights, label?)`: 加权随机选择
 * - `getTrace()`: 获取调用轨迹（用于回放）
 */

import seedrandom from 'seedrandom';

import type { RNG } from './types';

/**
 * 幸运值偏置算法
 *
 * 计算幸运值（LUK）对随机概率的加成。
 *
 * **数学模型**：
 * ```
 * bias(luk) = maxBias * (1 - exp(-luk / k))
 * ```
 *
 * **特性**：
 * - 使用指数衰减函数（递减边际收益）
 * - LUK 越高，加成越高，但逐渐趋近上限
 * - 不同领域使用不同参数：
 *   - EVENT: k=60, maxBias=0.25 (事件池，加成更强)
 *   - COMBAT: k=120, maxBias=0.08 (战斗，加成更弱)
 *
 * **示例**：
 * - EVENT 域，LUK=50: bias ≈ 0.25 * (1 - e^(-50/60)) ≈ 0.13
 * - COMBAT 域，LUK=50: bias ≈ 0.08 * (1 - e^(-50/120)) ≈ 0.03
 *
 * @param domain - 随机域（EVENT 或 COMBAT）
 * @param luk - 幸运值（非负整数）
 * @returns 概率加成（[0, maxBias]）
 */
function luckBias(domain: 'EVENT' | 'COMBAT', luk: number): number {
  const k = domain === 'EVENT' ? 60 : 120; // 衰减常数，决定曲线陡峭程度
  const maxBias = domain === 'EVENT' ? 0.25 : 0.08; // 最大概率加成上限 (25% 或 8%)
  return maxBias * (1 - Math.exp(-Math.max(0, luk) / k));
}

/**
 * 数值限制到 [0, 1] 区间
 *
 * 用于确保概率值在有效范围内。
 *
 * @param value - 任意数值
 * @returns 限制后的数值
 */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * 创建 RNG 实例
 *
 * @param seed - 随机数种子（通常来自战斗输入）
 * @returns RNG 接口实现
 *
 * **实现细节**：
 * - 使用 `seedrandom` 包生成伪随机序列
 * - 维护内部调用计数器和轨迹数组
 * - 所有方法都通过内部的 `next(label)` 获取随机数
 */
export function createRng(seed: string): RNG {
  // 原始 seedrandom 实例
  const raw = seedrandom(seed);

  // 调用轨迹：记录每次 RNG 调用（用于回放）
  const trace: Array<{ n: number; label: string; value: number }> = [];

  // 调用计数器（用于生成序号）
  let calls = 0;

  /**
   * 内部随机数生成器
   *
   * 每次调用：
   * 1. 从 raw 获取 [0, 1) 随机数
   * 2. 递增调用计数
   * 3. 记录到轨迹（序号、标签、返回值）
   *
   * @param label - 调用点标识（用于调试和回放）
   * @returns [0, 1) 随机数
   */
  const next = (label = 'next'): number => {
    const value = raw();
    calls += 1;
    trace.push({ n: calls, label, value });
    return value;
  };

  return {
    /**
     * 生成基础随机数
     *
     * @param label - 调用点标识
     * @returns [0, 1) 随机数
     */
    next,

    /**
     * 生成范围内的随机整数
     *
     * 注意：返回值可能是浮点数（不取整），由调用者决定如何使用
     *
     * @param min - 最小值（包含）
     * @param max - 最大值（包含）
     * @param label - 调用点标识
     * @returns [min, max] 范围内的随机数
     *
     * 示例：
     * - range(0, 10) → 可能返回 3.716...
     * - Math.floor(range(0, 10)) → 0 到 10 的随机整数
     */
    range(min: number, max: number, label = 'range') {
      return min + (max - min) * next(label);
    },

    /**
     * 概率判定（支持幸运加成）
     *
     * **判定逻辑**：
     * 1. 验证输入（chance 必须是有限数值）
     * 2. 边界情况处理（≤0=false, ≥1=true）
     * 3. 计算幸运加成（如果提供 luck 参数）
     * 4. 生成随机数并与结果概率比较
     *
     * **幸运加成公式**：
     * ```
     * resultChance = clamp(chance + luckBias(luck.domain, luck.luk))
     * ```
     *
     * @param chance - 基础概率 [0, 1]
     * @param luck - 可选的幸运加成配置
     * @param label - 调用点标识
     * @returns true=命中, false=未命中
     *
     * 示例：
     * - bool(0.5) → 50% 概率返回 true
     * - bool(0.3, { domain: 'EVENT', luk: 50 }) → 约 43% 概率（+13% 加成）
     */
    bool(chance: number, luck, label = 'bool') {
      // 输入验证
      if (!Number.isFinite(chance)) {
        return false;
      }
      // 边界处理
      if (chance <= 0) {
        return false;
      }
      if (chance >= 1) {
        return true;
      }

      // 计算幸运加成
      const bias = luck ? luckBias(luck.domain, luck.luk) : 0;
      const resultChance = clamp01(chance + bias);

      // 随机判定
      return next(label) < resultChance;
    },

    /**
     * 加权随机选择
     *
     * **算法**：
     * 1. 计算每个选项的权重（调用 weights 函数）
     * 2. 归一化权重（确保非负）
     * 3. 计算总权重
     * 4. 生成随机游标 [0, total)
     * 5. 累加权重，找到第一个超过游标的选项
     *
     * **权重函数**：
     * - `weights(item)` 应该返回非负数值
     * - 负数会被归零（Math.max(0, ...)）
     *
     * @param options - 选项数组
     * @param weights - 权重计算函数
     * @param label - 调用点标识
     * @returns 被选中的选项
     *
     * 示例：
     * ```typescript
     * const items = [
     *   { id: 'a', weight: 10 },
     *   { id: 'b', weight: 20 },
     *   { id: 'c', weight: 30 }
     * ];
     * const picked = rng.weightedPick(items, item => item.weight);
     * // a: 16.7% 概率 (10/60)
     * // b: 33.3% 概率 (20/60)
     * // c: 50.0% 概率 (30/60)
     * ```
     */
    weightedPick<T>(options: T[], weights: (item: T) => number, label = 'weightedPick'): T {
      // 归一化权重（确保非负）
      const normalized = options.map((item) => Math.max(0, weights(item)));

      // 计算总权重
      const total = normalized.reduce((sum, value) => sum + value, 0);

      // 边界情况：总权重为 0
      if (total <= 0) {
        return options[0];
      }

      // 生成随机游标
      const cursor = next(label) * total;

      // 累加查找
      let acc = 0;
      for (let index = 0; index < options.length; index += 1) {
        acc += normalized[index];
        if (cursor <= acc) {
          return options[index];
        }
      }

      // 浮点误差兜底
      return options[options.length - 1];
    },

    /**
     * 获取 RNG 调用轨迹
     *
     * 返回所有调用的历史记录：
     * - n: 调用序号（自增）
     * - label: 调用点标识
     * - value: 返回的随机数
     *
     * **用途**：
     * - 战斗回放：重新执行相同的 RNG 序列
     * - 调试：查看随机数生成过程
     * - 验证：确认随机性是否符合预期
     *
     * @returns 轨迹数组的副本（防止外部修改）
     */
    getTrace() {
      return trace;
    },
  };
}
