/**
 * 事件调度器
 *
 * 管理随机事件池的触发时机和概率。
 *
 * **职责**：
 * - 存储事件池（pools）和调度规则（rules）
 * - 根据触发窗口（window）查询适用的规则
 *
 * **使用场景**：
 * - 回合开始/结束时触发全局事件（天气、突发新闻等）
 * - 行动开始/结束时触发个人事件（幸运事件、倒霉事件等）
 */

import type { EventPoolSpec } from './types';

/**
 * 触发窗口
 *
 * 定义事件池可以在何时触发：
 * - RoundStart: 回合开始（全局事件）
 * - RoundEnd: 回合结束（全局事件）
 * - TurnStart: 行动开始（个人事件）
 * - TurnEnd: 行动结束（个人事件）
 */
export type TriggerWindow = 'RoundStart' | 'RoundEnd' | 'TurnStart' | 'TurnEnd';

/**
 * 调度规则
 *
 * 定义事件池的触发配置：
 * - window: 触发时机
 * - poolId: 要触发的事件池 ID
 * - chance: 触发概率 [0, 1]
 *
 * 示例：
 * { window: 'RoundStart', poolId: 'pool.round.global', chance: 0.28 }
 * → 每回合开始时有 28% 概率触发全局事件池
 */
export type SchedulerRule = {
  window: TriggerWindow; // 触发窗口
  poolId: string; // 事件池 ID
  chance: number; // 触发概率
};

/**
 * 事件调度器类
 *
 * 提供规则查询接口，供引擎主循环使用。
 *
 * **构造参数**：
 * - pools: 事件池映射表（poolId → EventPoolSpec）
 * - rules: 调度规则列表
 *
 * **方法**：
 * - getRules(window): 查询指定窗口的所有有效规则
 *   - 过滤条件：rule.window === window
 *   - 验证条件：pools[rule.poolId] 存在
 */
export class EventScheduler {
  constructor(
    private readonly pools: Record<string, EventPoolSpec>, // 事件池映射表
    private readonly rules: SchedulerRule[], // 调度规则列表
  ) {}

  /**
   * 查询指定窗口的所有有效规则
   *
   * **过滤逻辑**：
   * 1. 只返回 window 匹配的规则
   * 2. 只返回 poolId 存在于 pools 的规则（防止引用不存在的池）
   *
   * **返回值**：SchedulerRule[]
   *
   * **使用示例**：
   * ```typescript
   * const rules = scheduler.getRules('RoundStart');
   * for (const rule of rules) {
   *   if (rng.bool(rule.chance)) {
   *     triggerPool(rule.poolId, 'ENV', 0);
   *   }
   * }
   * ```
   */
  getRules(window: TriggerWindow): SchedulerRule[] {
    return this.rules.filter((rule) => rule.window === window && this.pools[rule.poolId]);
  }
}
