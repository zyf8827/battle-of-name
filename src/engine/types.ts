/**
 * 基础属性类型
 *
 * 四维属性系统：
 * - STR (力量): 影响物理攻击伤害
 * - AGI (敏捷): 影响回合内的出手顺序（行动速度）
 * - VIT (体质): 影响最大生命值
 * - LUK (幸运): 影响随机事件倾向和暴击率微调
 */
export type BaseStats = {
  STR: number; // 力量：物理攻击力
  AGI: number; // 敏捷：行动速度
  VIT: number; // 体质：生命值上限
  LUK: number; // 幸运：随机加成
};

/**
 * 修饰器来源类型
 *
 * 用于标识修饰器的来源，影响叠加策略和移除规则：
 * - PASSIVE: 被动技能（通常不可移除）
 * - EQUIP: 装备提供的属性/效果
 * - BUFF: 增益效果（通常有时间限制）
 * - ENV: 环境效果（来自事件池等）
 * - TALENT: 天赋（职业固有特性）
 */
export type ModifierSource = 'PASSIVE' | 'EQUIP' | 'BUFF' | 'ENV' | 'TALENT';

/**
 * 战斗标签
 *
 * 用于标识事件或修饰器的性质，用于触发器条件判断：
 * - physical: 物理伤害
 * - magic: 魔法伤害
 * - true_damage: 真实伤害（无视护甲）
 * - heal: 治疗
 * - shield: 护盾
 * - dot: 持续伤害（Damage over Time）
 * - control: 控制效果（眩晕、冰冻等）
 * - reflect: 反射伤害
 * - crit: 暴击
 * - miss: 未命中
 * - immune: 免疫
 * - buff: 增益效果
 * - debuff: 减益效果
 * - env: 环境相关
 * - talent: 天赋相关
 * - equip: 装备相关
 */
export type CombatTag =
  | 'physical'
  | 'magic'
  | 'true_damage'
  | 'heal'
  | 'shield'
  | 'dot'
  | 'control'
  | 'reflect'
  | 'crit'
  | 'miss'
  | 'immune'
  | 'buff'
  | 'debuff'
  | 'env'
  | 'talent'
  | 'equip';

/**
 * 修饰器叠加策略
 *
 * 当应用同 ID 或同 stackKey 的修饰器时的处理方式：
 * - STACK: 叠加层数（maxStacks 限制最大层数）
 * - REFRESH_DURATION: 刷新持续时间（层数重置为 1）
 * - REPLACE: 替换（移除旧的，应用新的）
 * - IGNORE: 忽略（不做任何处理）
 */
export type StackPolicy = 'STACK' | 'REFRESH_DURATION' | 'REPLACE' | 'IGNORE';

/**
 * 文本模板
 *
 * 支持两种格式：
 * - string: 单个模板
 * - string[]: 模板数组（随机选择一个）
 *
 * 模板中可以使用变量占位符，如 {sourceName}、{targetName}、{damage} 等
 */
export type TextTemplate = string | string[];

/**
 * 修饰器叠加规则
 *
 * - stackKey: 叠加标识（相同 key 的修饰器按此规则叠加）
 * - policy: 叠加策略（见 StackPolicy）
 * - maxStacks: 最大叠加层数（仅 STACK 策略有效）
 */
export type ModifierStacking = {
  stackKey: string; // 叠加键值
  policy: StackPolicy; // 叠加策略
  maxStacks?: number; // 最大层数（可选）
};

/**
 * 战斗单位
 *
 * 表示战场上的一个角色（玩家或敌人），包含静态属性和动态状态。
 *
 * 核心字段：
 * - id: 全局唯一标识符
 * - name: 显示名称
 * - classId/className: 职业信息
 * - stats: 四维基础属性（由姓名哈希生成）
 *
 * state - 动态战斗状态：
 * - hp/maxHp: 当前/最大生命值
 * - shield: 护盾值（优先承受伤害）
 * - cd: 冷却时间映射表（key: 修饰器ID, value: 剩余回合数）
 * - rewindUsed: 是否已使用过时光回溯
 * - consumables: 持有的消耗品 ID 列表
 *
 * modifiers - 当前应用的所有修饰器（装备、天赋、Buff等）
 */
export interface Unit {
  id: string; // 唯一标识
  name: string; // 显示名称
  classId?: string; // 职业 ID
  className?: string; // 职业名称
  stats: BaseStats; // 四维属性
  state: {
    hp: number; // 当前生命值
    maxHp: number; // 最大生命值
    shield: number; // 护盾值
    cd: Record<string, number>; // 冷却时间记录
    rewindUsed?: boolean; // 是否已使用时光回溯
    consumables?: string[]; // 持有的消耗品
  };
  modifiers: Modifier[]; // 活跃修饰器列表
}

/**
 * 修饰器钩子函数集合
 *
 * 提供 7 个生命周期钩子，用于在特定时机注入自定义逻辑：
 *
 * === 时间轴钩子 ===
 * - onRoundStart: 每回合开始时调用（全局触发）
 * - onRoundEnd: 每回合结束时调用（全局触发）
 * - onTurnStart: 单位回合开始时调用
 * - onTurnEnd: 单位回合结束时调用
 *
 * === 事件管道钩子 ===
 * - onOutgoing: 事件发出前（Phase 1 - Interception）
 *   可修改事件或返回 null 阻止事件
 * - onIncoming: 事件结算前（Phase 1 - Interception）
 *   可修改事件或返回 null 阻止事件
 * - onPostAction: 事件结算后（Phase 3 - Reaction）
 *   可生成新事件（如吸血、反射）
 *
 * 执行顺序：
 * 按修饰器的 priority → appliedOrder → id 排序，确保确定性
 */
export interface ModifierHooks {
  onRoundStart?: (ctx: TriggerContext) => void; // 回合开始
  onRoundEnd?: (ctx: TriggerContext) => void; // 回合结束
  onTurnStart?: (ctx: TriggerContext) => void; // 行动开始
  onTurnEnd?: (ctx: TriggerContext) => void; // 行动结束
  onOutgoing?: (event: CombatEvent, ctx: InteractionContext) => CombatEvent | null; // 事件发出前
  onIncoming?: (event: CombatEvent, ctx: InteractionContext) => CombatEvent | null; // 事件结算前
  onPostAction?: (event: CombatEvent, ctx: InteractionContext) => CombatEvent[]; // 事件结算后
}

/**
 * 数值表达式
 *
 * 用于效果系统中的动态数值计算：
 * - FLAT: 固定值
 * - SCALE: 基于属性缩放（如 value = stat * ratio）
 * - EVENT_VALUE: 使用事件的原始 value
 */
export type ValueExpr =
  | { type: 'FLAT'; value: number } // 固定值
  | { type: 'SCALE'; stat: keyof BaseStats; ratio: number } // 属性缩放
  | { type: 'EVENT_VALUE' }; // 事件数值

/**
 * 目标选择器
 *
 * - SELF: 修饰器拥有者自己
 * - SOURCE: 事件的发起者
 * - TARGET: 事件的目标
 */
export type TargetSelector = 'SELF' | 'SOURCE' | 'TARGET';

/**
 * 效果目标类型
 *
 * 继承 TargetSelector，并支持：
 * - ALL: 场上所有单位
 * - ENV: 环境（全局效果）
 */
export type EventEffectTarget = TargetSelector | 'ALL' | 'ENV';

/**
 * 触发器条件匹配规则
 *
 * 用于修饰器触发器的 `when` 字段，判断是否应该触发：
 *
 * - role: 单位角色（SOURCE 或 TARGET）
 * - eventType: 事件类型（如 'ATTACK', 'HEAL'）
 * - hasTag: 必须包含的标签
 * - notHasTag: 不能包含的标签
 * - notHasTags: 不能包含的标签列表（全部不能有）
 *
 * 示例：
 * { role: 'TARGET', hasTag: 'physical' } - 作为物理攻击目标时触发
 */
export type EventWhen = {
  role?: 'SOURCE' | 'TARGET'; // 单位角色
  eventType?: CombatEvent['type']; // 事件类型
  hasTag?: CombatTag; // 必须包含的标签
  notHasTag?: CombatTag; // 不能包含的标签（单个）
  notHasTags?: CombatTag[]; // 不能包含的标签（多个）
};

/**
 * 触发器规格
 *
 * 定义修饰器的触发时机和条件：
 *
 * === 时间轴触发 ===
 * - ROUND_START: 回合开始
 * - TURN_START: 单位回合开始
 *
 * === 事件管道触发 ===
 * - PIPELINE_OUTGOING: 事件发出前（Phase 1），支持 when 条件
 * - PIPELINE_INCOMING: 事件结算前（Phase 1），支持 when 条件
 * - POST_ACTION: 事件结算后（Phase 3），支持 when 条件
 *
 * === 简化触发（语法糖） ===
 * - ON_HIT: 命中时（相当于 PIPELINE_INCOMING + !miss）
 * - ON_HURT: 受伤时（相当于 PIPELINE_INCOMING + !miss + !immune）
 */
export type TriggerSpec =
  | { on: 'ROUND_START' } // 回合开始
  | { on: 'TURN_START' } // 行动开始
  | { on: 'PIPELINE_INCOMING'; when?: EventWhen } // 事件结算前
  | { on: 'PIPELINE_OUTGOING'; when?: EventWhen } // 事件发出前
  | { on: 'POST_ACTION'; when?: EventWhen } // 事件结算后
  | { on: 'ON_HIT'; when?: Omit<EventWhen, 'eventType'> } // 命中时
  | { on: 'ON_HURT'; when?: Omit<EventWhen, 'eventType'> }; // 受伤时

/**
 * 修饰器文本模板覆盖
 *
 * 为修饰器的不同生命周期提供自定义文本：
 * - apply: 应用时显示的文本
 * - remove: 移除时显示的文本
 * - trigger: 触发时显示的文本（默认）
 * - triggerByTag: 按标签区分的触发文本（如 'physical': '反射了 {damage} 点物理伤害'）
 * - tick: 每回合持续时间减少时显示的文本
 */
export type ModifierTextOverrides = {
  apply?: TextTemplate; // 应用时
  remove?: TextTemplate; // 移除时
  trigger?: TextTemplate; // 触发时（默认）
  triggerByTag?: Partial<Record<CombatTag, TextTemplate>>; // 按标签定制触发文本
  tick?: TextTemplate; // 持续时间减少时
};

/**
 * 效果规格
 *
 * 声明式效果定义，用于修饰器触发器和事件池：
 * - kind: 效果类型（如 'LIFESTEAL', 'SHIELD', 'APPLY_MODIFIER' 等）
 * - target: 效果作用目标
 * - [key: string]: 其他效果参数（根据 kind 不同而不同）
 *
 * 示例：
 * { kind: 'SHIELD', value: { type: 'FLAT', value: 10 }, target: 'SELF' }
 * { kind: 'APPLY_MODIFIER', modifierId: 'buff.burning', target: 'TARGET' }
 */

/**
 * 内置效果类型的具体定义（编译期类型安全）
 * 这些类型定义了每种效果所需的参数
 */
export type BuiltinEffectSpec =
  | {
      kind: 'APPLY_MODIFIER';
      target?: EventEffectTarget;
      modifierId?: string;
      modifier?: Modifier;
      duration?: number;
      textOverrides?: Modifier['texts'];
    }
  | { kind: 'TRIGGER_EVENT_POOL'; poolId: string }
  | {
      kind: 'SHIELD';
      target?: EventEffectTarget;
      value: ValueExpr[];
      tags: CombatTag[];
    }
  | { kind: 'LIFESTEAL'; ratio: number; tags: CombatTag[] }
  | {
      kind: 'DISPEL';
      target: TargetSelector;
      mode: 'BUFF' | 'DEBUFF' | 'ANY';
      byTag?: CombatTag;
      max?: number;
    }
  | { kind: 'MITIGATE'; when: EventWhen; multiplier: number; min?: number }
  | {
      kind: 'DIRECT_DAMAGE';
      target: EventEffectTarget;
      value: number;
      tags?: CombatTag[];
    }
  | {
      kind: 'DIRECT_HEAL';
      target: EventEffectTarget;
      value: number;
      tags?: CombatTag[];
    }
  | {
      kind: 'GRANT_CONSUMABLE';
      target: EventEffectTarget;
      consumableId: string;
    }
  | { kind: 'GRANT_RANDOM_CONSUMABLE'; target: EventEffectTarget }
  | {
      kind: 'LOSE_RANDOM_CONSUMABLE';
      target: EventEffectTarget;
      count?: number;
    }
  | { kind: 'GRANT_EQUIPMENT'; target: EventEffectTarget; equipment: Modifier }
  | {
      kind: 'GRANT_RANDOM_EQUIPMENT';
      target: EventEffectTarget;
      slot?: 'WEAPON' | 'ARMOR' | 'ACCESSORY';
    }
  | {
      kind: 'LOSE_RANDOM_EQUIPMENT';
      target: EventEffectTarget;
      slot?: 'WEAPON' | 'ARMOR' | 'ACCESSORY';
    };

/**
 * 所有内置效果的 kind 类型
 */
export type BuiltinEffectKind = BuiltinEffectSpec['kind'];

/**
 * 类型安全的效果规格
 *
 * 使用条件类型实现编译期类型检查：
 * - 如果 kind 是内置效果类型，则使用对应的严格类型定义
 * - 如果 kind 是未知类型，则保留开放结构以支持扩展
 *
 * 示例：
 * ```typescript
 * // ✅ 编译通过：参数匹配
 * const shield: EffectSpec<'SHIELD'> = { kind: 'SHIELD', value: [...], tags: [...] }
 *
 * // ❌ 编译报错：缺少必需参数
 * const badShield: EffectSpec<'SHIELD'> = { kind: 'SHIELD' }
 *
 * // ✅ 扩展效果：使用开放结构
 * const custom: EffectSpec<'CUSTOM_EFFECT'> = { kind: 'CUSTOM_EFFECT', customParam: 123 }
 * ```
 */
export type EffectSpec<K extends string = BuiltinEffectKind> = K extends BuiltinEffectKind
  ? Extract<BuiltinEffectSpec, { kind: K }> // 内置效果：严格类型
  : { kind: K; target?: EventEffectTarget; [key: string]: unknown }; // 扩展效果：开放结构

/**
 * 修饰器规格定义
 *
 * 修饰器是游戏的核心抽象，所有改变游戏逻辑的实体都是修饰器。
 *
 * 核心字段：
 * - id: 全局唯一标识（命名规范：source.type.name，如 'equip.weapon.keyboard'）
 * - source: 来源类型（PASSIVE/EQUIP/BUFF/ENV/TALENT）
 * - name: 显示名称
 *
 * 效果定义（二选一）：
 * - triggers: DSL 声明式触发器（推荐，80% 场景适用）
 * - hooks: 自定义钩子函数（灵活，需要编写代码）
 *
 * 其他字段：
 * - priority: 优先级（影响触发顺序，数值越小越先触发）
 * - duration: 持续时间（回合数，-1 表示永久）
 * - tags: 标签（用于条件匹配）
 * - stacking: 叠加规则
 * - statBonus: 属性加成
 * - texts: 文本模板覆盖
 */
export type ModifierSpec = {
  id: string; // 唯一标识
  source: ModifierSource; // 来源类型
  name: string; // 显示名称
  description?: string; // 描述文本
  texts?: ModifierTextOverrides; // 文本模板
  priority?: number; // 优先级（默认 0）
  duration?: number; // 持续时间（-1 = 永久）
  tags?: CombatTag[]; // 标签列表
  stacking?: ModifierStacking; // 叠加规则
  statBonus?: Partial<BaseStats>; // 属性加成
  triggers?: Array<{ trigger: TriggerSpec; effects: EffectSpec[] }>; // DSL 触发器
  hooks?: ModifierHooks; // 自定义钩子
};

/**
 * 修饰器实例
 *
 * 继承 ModifierSpec，添加运行时字段：
 * - appliedOrder: 应用顺序（用于确定性排序）
 * - stacks: 当前叠加层数
 */
export interface Modifier extends ModifierSpec {
  appliedOrder?: number; // 应用顺序（第几个被应用）
  stacks?: number; // 当前层数（叠加时使用）
}

/**
 * 战斗事件
 *
 * 事件是游戏的核心抽象，所有战斗行为都通过事件表达。
 *
 * 事件流程（三阶段管道）：
 * 1. Phase 1 - Interception (拦截): onOutgoing/onIncoming 钩子可修改事件
 * 2. Phase 2 - Resolution (结算): 事件实际生效（HP 变化、状态更新）
 * 3. Phase 3 - Reaction (反应): onPostAction 钩子可生成新事件（递归 DFS）
 *
 * 核心字段：
 * - id: 事件唯一标识
 * - type: 事件类型（ATTACK/HEAL/APPLY_BUFF/REMOVE_BUFF/DEATH）
 * - sourceId/targetId: 事件发起者和目标
 *
 * meta - 元数据（用于日志和回放）：
 * - round: 回合数
 * - turn: 本回合内的行动序号
 * - seq: 全局事件序号（自增）
 *
 * payload - 事件负载（Readonly，确保不可变）：
 * - value: 数值（伤害量、治疗量）
 * - modifier: 修饰器（APPLY_BUFF/REMOVE_BUFF 时使用）
 * - tags: 标签（物理/魔法/暴击等）
 * - isCrit: 是否暴击
 * - isMiss: 是否未命中
 *
 * 递归控制：
 * - depth: 当前递归深度（防止无限循环）
 * - parentId: 父事件 ID（用于构建事件树）
 */
export interface CombatEvent {
  id: string; // 唯一标识
  type: 'ATTACK' | 'HEAL' | 'APPLY_BUFF' | 'REMOVE_BUFF' | 'DEATH'; // 事件类型
  sourceId: string; // 发起者 ID
  targetId: string; // 目标 ID
  meta: {
    round: number; // 回合数
    turn: number; // 行动序号
    seq: number; // 全局序号
  };
  payload: Readonly<{
    // 不可变负载
    value?: number; // 数值
    modifier?: Modifier; // 修饰器
    tags: CombatTag[]; // 标签
    isCrit?: boolean; // 暴击标记
    isMiss?: boolean; // 未命中标记
  }>;
  depth: number; // 递归深度
  parentId?: string; // 父事件 ID
}

/**
 * 触发器上下文（时间轴钩子用）
 *
 * 提供给 onRoundStart/onRoundEnd/onTurnStart/onTurnEnd 钩子：
 * - engine: 引擎运行时 API
 * - owner: 修饰器拥有者
 */
export type TriggerContext = {
  engine: EngineRuntime; // 引擎运行时
  owner: Unit; // 修饰器拥有者
};

/**
 * 交互上下文（事件管道钩子用）
 *
 * 提供给 onOutgoing/onIncoming/onPostAction 钩子：
 * 继承 TriggerContext，并添加事件参与者信息：
 * - source: 事件发起者
 * - target: 事件目标
 */
export type InteractionContext = TriggerContext & {
  source: Unit; // 事件发起者
  target: Unit; // 事件目标
};

/**
 * 事件池条目
 *
 * 可被随机事件池触发的事件：
 * - id: 唯一标识
 * - name: 显示名称
 * - weight: 权重（影响被选中的概率）
 * - effects: 效果列表
 * - texts: 文本模板
 */
export const DEFAULT_EVENT_POOL_ENTRY_WEIGHT = 10;

export type EventPoolEntry = {
  id: string; // 唯一标识
  name: string; // 显示名称
  weight?: number; // 权重（未配置时使用默认权重）
  effects: EffectSpec[]; // 效果列表
  texts?: {
    // 文本模板
    trigger?: TextTemplate;
    tick?: TextTemplate;
  };
};

/**
 * 时光回溯触发原因
 *
 * 记录时光回溯的来源，用于日志显示：
 * - sourceType: 来源类型
 * - sourceId: 来源 ID
 * - sourceName: 来源名称
 */
export type RewindReason = {
  sourceType?: 'consumable' | 'event' | 'talent' | 'system'; // 来源类型
  sourceId?: string; // 来源 ID
  sourceName?: string; // 来源名称
};

/**
 * 事件池规格
 *
 * 定义一个可随机触发的事件池：
 * - id: 池 ID
 * - domain: 触发时机（EVENT=特定时机触发，COMBAT=战斗相关）
 * - entries: 池中的事件条目列表
 */
export type EventPoolSpec = {
  id: string; // 池 ID
  domain: 'EVENT' | 'COMBAT'; // 触发域
  entries: EventPoolEntry[]; // 事件条目
};

/**
 * 引擎限制配置
 *
 * 用于防止无限循环和性能问题：
 * - maxEventDepth: 最大事件递归深度（如 10）
 * - maxEventsPerRound: 每回合最大事件数
 * - maxDerivedEventsPerEvent: 单个事件最多生成衍生事件数
 * - maxTriggersPerModifierPerRound: 单个修饰器每回合最大触发次数
 */
export type EngineLimits = {
  maxEventDepth: number; // 最大递归深度
  maxEventsPerRound: number; // 每回合最大事件数
  maxDerivedEventsPerEvent: number; // 单事件最大衍生数
  maxTriggersPerModifierPerRound: number; // 单修饰器每回合最大触发次数
};

/**
 * 战斗平衡参数
 *
 * 控制数值计算的基准值：
 * - hpBase: 基础生命值（无VIT加成时）
 * - hpPerVit: 每点VIT增加的生命值
 */
export type BattleBalanceParams = {
  hpBase: number; // 基础生命值
  hpPerVit: number; // 每点VIT的生命值加成
};

/**
 * 战斗配置
 *
 * 允许自定义战斗引擎的核心参数：
 * - balance: 数值平衡参数
 * - limits: 引擎限制参数
 * - maxRounds: 最大回合数（超时判负）
 */
export type BattleConfig = {
  balance?: Partial<BattleBalanceParams>;
  limits?: Partial<EngineLimits>;
  maxRounds?: number;
  diagnostics?: {
    debugLog?: boolean;
    collectSummary?: boolean;
  };
};

/**
 * 默认战斗配置常量
 */
export const DEFAULT_BATTLE_CONFIG: Readonly<{
  balance: BattleBalanceParams;
  limits: EngineLimits;
  maxRounds: number;
}> = {
  balance: {
    hpBase: 102,
    hpPerVit: 11,
  },
  limits: {
    maxEventDepth: 8,
    maxEventsPerRound: 256,
    maxDerivedEventsPerEvent: 12,
    maxTriggersPerModifierPerRound: 32,
  },
  maxRounds: 100,
};

/**
 * 日志条目
 *
 * 战斗日志中的单条记录：
 * - round/turn/seq: 时间戳信息
 * - text: 显示文本（已渲染）
 * - tags: 标签（用于样式或过滤）
 * - eventId/eventType: 关联事件
 * - actorId/actorName/targetId/targetName: 参与者信息
 */
export type LogEntry = {
  round: number; // 回合数
  turn: number; // 行动序号
  seq: number; // 全局序号
  text: string; // 渲染后的文本
  tags: CombatTag[]; // 标签
  eventId?: string; // 关联事件 ID
  eventType?: CombatEvent['type']; // 关联事件类型
  actorId?: string; // 行动者 ID
  actorName?: string; // 行动者名称
  targetId?: string; // 目标 ID
  targetName?: string; // 目标名称
};

/**
 * 回放记录
 *
 * 完整记录一场战斗，支持精确重放：
 * - engineVersion: 引擎版本（兼容性检查）
 * - seed: 战斗种子
 * - initialState: 初始状态快照
 * - rngTrace: RNG 调用轨迹（每次调用的 label 和返回值）
 * - eventTrace: 事件轨迹（所有发生的事件及其关系）
 */
export type ReplayRecord = {
  engineVersion: string; // 引擎版本
  seed: string; // 战斗种子
  initialState: Snapshot; // 初始快照
  rngTrace: Array<{ n: number; label: string; value: number }>; // RNG 轨迹
  eventTrace: Array<{
    // 事件轨迹
    eventId: string;
    parentId?: string;
    type: string;
    meta: { round: number; turn: number; seq: number };
    tags: CombatTag[];
  }>;
};

/**
 * 战斗状态快照
 *
 * 记录某一时刻的完整战斗状态：
 * - round: 当前回合数
 * - units: 所有单位的状态（深拷贝）
 * - envModifiers: 环境修饰器列表
 */
export type Snapshot = {
  round: number; // 当前回合
  units: Array<{
    // 所有单位
    id: string;
    name: string;
    stats: BaseStats;
    state: Unit['state'];
    modifiers: Modifier[];
  }>;
  envModifiers: Modifier[]; // 环境修饰器
};

/**
 * 战斗结果
 *
 * 战斗结束后的完整输出：
 * - seed: 战斗种子
 * - winnerId: 胜利者 ID
 * - logs: 完整日志列表
 * - snapshots: 关键时刻快照（每回合结束时）
 * - replay: 回放记录（用于精确重放）
 * - summary: 统计摘要
 */
export type BattleOutcome = {
  seed: string; // 战斗种子
  winnerId: string; // 胜利者 ID
  logs: LogEntry[]; // 战斗日志
  snapshots: Snapshot[]; // 状态快照
  replay: ReplayRecord; // 回放记录
  summary: {
    // 统计摘要
    totalRounds: number; // 总回合数
    totalDamageByUnit: Record<string, number>; // 各单位总伤害
    diagnostics?: {
      eventsProcessed: number;
      eventsSkipped: {
        dedup: number;
        depthOrBudget: number;
        sourceDead: number;
        targetDead: number;
      };
      poolsTriggered: Record<string, number>;
      poolEntriesTriggered: Record<string, number>;
      effectsTriggered: Record<string, number>;
    };
  };
};

/**
 * 随机数生成器接口
 *
 * 提供确定性随机（基于种子），确保相同 seed → 相同结果：
 *
 * - next(label?): 生成 [0, 1) 随机数
 * - range(min, max, label?): 生成 [min, max] 随机整数
 * - bool(chance, luck?, label?): 概率判定（可加幸运加成）
 * - weightedPick(options, weights, label?): 加权随机选择
 * - getTrace(): 获取 RNG 调用轨迹（用于回放）
 *
 * label 参数用于调试和回放（记录每次调用的用途）
 */
export interface RNG {
  next(label?: string): number; // [0, 1) 随机数
  range(min: number, max: number, label?: string): number; // [min, max] 随机整数
  bool(chance: number, luck?: { domain: 'EVENT' | 'COMBAT'; luk: number }, label?: string): boolean; // 概率判定
  weightedPick<T>(options: T[], weights: (item: T) => number, label?: string): T; // 加权选择
  getTrace(): Array<{ n: number; label: string; value: number }>; // 获取轨迹
}

/**
 * 运行时数学工具集
 *
 * 提供战斗计算相关的安全函数：
 *
 * === 通用工具 ===
 * - clamp: 数值限制在 [min, max] 范围
 * - toInt: 浮点转整数（可选范围限制）
 * - nonNegativeInt: 确保非负整数
 *
 * === 战斗属性安全化 ===
 * - safeStat: 属性值安全化（最小 0）
 * - safeHp: 生命值安全化（范围 [0, maxHp]）
 * - safeShield: 护盾值安全化（最小 0）
 *
 * === 概率计算 ===
 * - chance: 基础概率（可配置范围）
 * - critRate: 暴击率 = base + luk * 系数
 * - evadeRate: 闪避率 = base + luk * 系数
 *
 * === 战斗计算 ===
 * - scale: 数值缩放（value * ratio，可选范围）
 * - splitDamageByShield: 伤害分配（护盾优先承受）
 * - hpAfterDamage: 扣除伤害后的 HP
 * - hpAfterHeal: 治疗后的 HP
 */
export type RuntimeMath = {
  clamp: (value: number, min: number, max: number) => number; // 数值限制
  toInt: (value: number, min?: number, max?: number) => number; // 转整数
  nonNegativeInt: (value: number, max?: number) => number; // 非负整数
  safeStat: (value: number) => number; // 安全属性值
  safeHp: (value: number, maxHp: number) => number; // 安全生命值
  safeShield: (value: number) => number; // 安全护盾值
  chance: (base: number, options?: { min?: number; max?: number }) => number; // 概率计算
  critRate: (base: number, luk: number) => number; // 暴击率
  evadeRate: (base: number, luk: number) => number; // 闪避率
  scale: (value: number, ratio: number, min?: number, max?: number) => number; // 缩放
  splitDamageByShield: (
    incoming: number,
    shield: number,
  ) => {
    // 伤害分配
    incoming: number; // 原始伤害
    shieldBlocked: number; // 护盾抵挡
    hpDamage: number; // HP 受伤
    shieldAfter: number; // 剩余护盾
  };
  hpAfterDamage: (hp: number, damage: number) => number; // 扣血后 HP
  hpAfterHeal: (hp: number, maxHp: number, amount: number) => number; // 治疗后 HP
};

/**
 * 引擎运行时接口
 *
 * 提供给修饰器钩子的完整 API 集合。
 * 按功能划分为 5 个模块：
 *
 * === 1. RNG ===
 * - rng: 随机数生成器（确定性，基于种子）
 *
 * === 2. calc - 数学计算 ===
 * - calc: 战斗相关的数学工具集
 *
 * === 3. rule - 规则引擎 ===
 * - evaluateValueExpr: 计算 ValueExpr（FLAT/SCALE/EVENT_VALUE）
 * - whenMatched: 判断 EventWhen 条件是否匹配
 *
 * === 4. event - 事件操作 ===
 * - make: 创建事件对象（自动生成 ID 和 meta）
 * - process: 处理事件（走三阶段管道）
 * - triggerPool: 触发事件池（随机选择池中的事件）
 * - emitDirectDamage: 发出直接伤害事件（绕过管道）
 * - emitDirectHeal: 发出直接治疗事件（绕过管道）
 *
 * === 5. state - 状态管理 ===
 * 目标解析：
 * - resolveTargets: 解析目标选择器（SELF/SOURCE/TARGET/ALL）
 * - resolveTargetFromEvent: 从事件解析目标
 *
 * 修饰器操作：
 * - applyModifierEffect: 应用修饰器效果
 * - removeModifiersByMatcher: 移除匹配的修饰器
 *
 * 物品管理：
 * - grantConsumable: 给予消耗品
 * - grantRandomConsumable: 给予随机消耗品
 * - loseRandomConsumable: 失去随机消耗品（count 个）
 * - loseConsumable: 移除指定消耗品（返回 boolean 是否成功）
 *
 * 装备管理：
 * - grantEquipment: 给予装备
 * - grantRandomEquipment: 给予随机装备（可选 slot）
 * - loseRandomEquipment: 移除随机装备（可选 slot）
 * - loseEquipment: 移除指定装备（返回 boolean 是否成功）
 *
 * 物品杂项：
 * - grantRandomItem: 给予随机物品（消耗品或装备）
 * - loseRandomItem: 移除随机物品
 *
 * === 6. log - 日志记录 ===
 * - system: 记录系统日志（使用文本模板）
 */
export type EngineRuntime = {
  rng: RNG; // 随机数生成器
  calc: RuntimeMath; // 数学计算工具
  rule: {
    evaluateValueExpr: (unit: Unit, event: CombatEvent | undefined, value: ValueExpr) => number; // 计算数值表达式
    whenMatched: (
      when: EventWhen | undefined,
      event: CombatEvent,
      role: 'SOURCE' | 'TARGET',
    ) => boolean; // 条件匹配
  };
  event: {
    make: (
      partial: Omit<CombatEvent, 'id' | 'meta'> & {
        meta?: Partial<CombatEvent['meta']>;
      },
    ) => CombatEvent; // 创建事件
    process: (event: CombatEvent) => void; // 处理事件
    triggerPool: (poolId: string, ownerId: string, depth: number, parentId?: string) => void; // 触发事件池
    emitDirectDamage: (
      owner: Unit,
      target: Unit,
      value: number,
      tags?: CombatTag[],
      depth?: number,
      parentId?: string,
    ) => void; // 直接伤害
    emitDirectHeal: (
      owner: Unit,
      target: Unit,
      value: number,
      tags?: CombatTag[],
      depth?: number,
      parentId?: string,
    ) => void; // 直接治疗
  };
  state: {
    resolveTargets: (owner: Unit, selector: EventEffectTarget) => Unit[]; // 解析目标列表
    resolveTargetFromEvent: (owner: Unit, selector: TargetSelector, event: CombatEvent) => Unit; // 从事件解析目标
    applyModifierEffect: (source: Unit, target: Unit, effect: EffectSpec) => void; // 应用修饰器效果
    removeModifiersByMatcher: (
      target: Unit,
      matcher: (modifier: Modifier) => boolean,
      max?: number,
    ) => number; // 移除修饰器
    grantConsumable: (target: Unit, consumableId: string) => void; // 给予消耗品
    grantRandomConsumable: (target: Unit) => void; // 给予随机消耗品
    loseRandomConsumable: (target: Unit, count?: number) => void; // 失去随机消耗品
    loseConsumable: (target: Unit, consumableId: string) => boolean; // 移除消耗品
    grantEquipment: (target: Unit, equipment: Modifier) => void; // 给予装备
    grantRandomEquipment: (target: Unit, slot?: 'WEAPON' | 'ARMOR' | 'ACCESSORY') => void; // 给予随机装备
    loseRandomEquipment: (target: Unit, slot?: 'WEAPON' | 'ARMOR' | 'ACCESSORY') => void; // 移除随机装备
    loseEquipment: (target: Unit, equipmentId: string) => boolean; // 移除装备
    grantRandomItem: (target: Unit) => void; // 给予随机物品
    loseRandomItem: (target: Unit) => void; // 移除随机物品
  };
  log: {
    system: (args: {
      key: string; // 日志 key
      variables: Record<string, string | number | undefined>; // 模板变量
      tags: CombatTag[]; // 标签
      actor?: Unit; // 行动者
      target?: Unit; // 目标
    }) => void; // 记录系统日志
  };
};
