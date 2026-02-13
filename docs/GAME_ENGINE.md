# 姓名大作战 (Name Battle) - 游戏引擎架构文档 (Game Engine Design)

> **版本**: 5.1 (Determinism & Content DSL Update)
> **日期**: 2026-02-12
> **依赖**: 对应 `GAME_DESIGN.md` v0.2
> **核心模式**: Event Queue (DFS) + Modifier System + Seeded RNG

---

## Part 1: 引擎设计说明 (Engine Design Logic)

本章节阐述游戏引擎的核心工作原理。理解这些概念是开发任何游戏内容（技能、装备、Buff）的前提。

### 1. 核心哲学 (Core Philosophy)

本引擎的设计遵循三个核心原则：
1.  **Modifier-First (修饰器优先)**: 游戏中不存在独立的“装备”或“被动”逻辑。一切改变数值或逻辑的对象（无论是手中的剑、身上的Buff，还是战场的天气）在引擎眼中都是 **Modifier**。
2.  **Event-Driven (事件驱动)**: 没有任何逻辑是直接修改属性的。A攻击B，不是直接 `B.hp -= 10`，而是广播一个 `ATTACK` 事件。该事件在落地前可能被无数拦截器修改。
3.  **Recursive Causality (递归因果)**: 一个事件可以引发另一个事件（如反伤、吸血）。引擎采用 **深度优先 (DFS)** 的方式处理这种连锁反应，确保因果链条的逻辑闭环。

### 2. 时间与循环 (Time & Loop)

游戏的时间单位严格划分为 **Round (回合)** 和 **Turn (行动)**。

- **Round (回合)**: 这是一个大的时间容器。
    - **快照 (Snapshot)**: 每个回合开始前，引擎会自动备份当前状态。这允许我们实现“时光倒流”类技能。
    - **钩子 (Hooks)**: 拥有 `onRoundStart` 和 `onRoundEnd` 两个全局触发点。
- **Turn (行动)**: 在一个回合内，所有存活单位根据 **敏捷 (AGI)** 排序，依次获得一次行动机会。
    - **行动权**: 只有当单位未处于“眩晕”等控制状态时，才能行动。
    - **决策**: 通过决策机制(通常是随机数)决定执行什么 Action（技能/道具/普攻）。

#### 2.1 权威 Game Loop 顺序 (Authoritative Combat Loop Order)
本小节是“实现口径”，用于统一 `GAME_DESIGN.md` 的战斗流程描述。

**每个 Round 的顺序如下（固定，不得随意挪动）：**

1. **RoundStart 快照**
  - 记录快照（用于回滚类机制）。
2. **onRoundStart（全局）**
  - 触发环境与单位的 `onRoundStart`（具体 hooks 顺序见 Part 2 的确定性规则）。
3. **环境事件窗口：RoundStart（可选）**
  - 随机事件属于“环境（ENV）修饰器”的行为，可在 RoundStart 窗口触发。
  - 该窗口用于“回合开始就发生的剧情/突发事件”（例如全员核酸、作者没灵感了）。
  - 触发方式二选一（但必须全局固定）：
    - A) 由 ENV Modifier 的 `onRoundStart` 直接派生事件；
    - B) 由统一的 `EventScheduler` 在该窗口生成事件（推荐，便于配置事件池）。
4. **冷却结算（Round-based CD）**
  - 所有单位的 `state.cd`：对 `> 0` 的条目统一 `-1`（最小为 0）。
  - 说明：本游戏 CD 以“回合”为单位，避免“行动次数差异”导致 CD 不公平。
5. **生成 Turn 队列（按 AGI 排序）**
  - 仅包含存活单位；若 AGI 相同，使用稳定排序（例如 `id`）保证确定性。
6. **依次执行每个单位的 Turn**
  1) **onTurnStart（单位）**：触发该单位身上的 `onTurnStart`。
  2) **状态结算（单位）**：DoT、护盾衰减、控制状态检查等。
  3) **行动判定**：若被控制则跳过行动（但仍会进入 onTurnEnd）。
  4) **决策并执行 Action**：
    - 产生一个或多个 `CombatEvent`，走完整 Event Pipeline（拦截 -> 结算 -> 反应，DFS）。
    - 技能/装备/天赋的优先级属于“内容层决策”，引擎只保证事件管道与确定性。
  5) **onTurnEnd（单位）**：触发该单位身上的 `onTurnEnd`。
7. **onRoundEnd（全局）**
  - 触发环境与单位的 `onRoundEnd`。
8. **Duration Tick & Remove（统一在 RoundEnd）**
  - 所有 `duration > 0` 的 modifier 统一 `-1`；变为 `0` 则移除。
9. **环境事件窗口：RoundEnd（可选）**
  - 用于“回合收尾/结算后发生的事件”（例如股市熔断、夜深网抑云）。
  - 抽取与权重必须通过 seeded RNG（不得使用 `Math.random()`）。

> 约束：随机事件不是“必须在最后”，但必须发生在**预定义窗口**中（RoundStart 或 RoundEnd，或未来扩展的窗口）。这样才能保持确定性与可调试性。

### 3. 事件处理管道 (The Event Pipeline)

这是引擎的心脏。当一个动作（Action）发生时，它会被转化为一个 **Event**，并经历以下三个阶段的处理：

#### Phase 1: 拦截 (Interception) - "我要修改这个事件"
事件尚未生效。引擎收集所有相关实体（攻击者、防御者、战场环境）身上的 Modifiers。
它们可以监听 `onOutgoing` (我发起的) 或 `onIncoming` (我承受的) 钩子。
*示例*: 攻击者发出 100点伤害事件 -> 防御者的【盾牌】拦截 -> 修改伤害为 50。

#### Phase 2: 结算 (Resolution) - "事件尘埃落定"
经过拦截后的最终事件被应用到游戏状态 (State)。
此时，HP 扣减、Buff 添加等操作正式完成，并写入战斗日志。

#### Phase 3: 反应 (Reaction) - "这件事引发了新情况"
事件已结算。系统再次查询 Modifiers，看是否有 `onPostAction` 钩子被触发。
如果触发，会生成 **新的衍生事件**。
*示例*: 结算扣血 50 -> 防御者的【荆棘甲】检测到受伤 -> 生成一个新的【反伤】事件。

**递归处理**: 衍生事件会立即被送回 Phase 1 重新走一遍流程（DFS），直到没有新事件产生或达到最大递归深度。

---

## Part 2: 技术规范 (Technical Specifications)

本章节定义了具体的代码接口契约。

### 0. 规范目标 (Design Goals for Implementation)
为保证“同 seed 可复现”、“内容可量产”、“机制可组合”，本规范额外强制以下工程约束：

1. **确定性 (Determinism)**: 同一初始状态 + 同一随机种子 => 完全一致的战斗过程与日志。
2. **事件不可变 (Immutable Event)**: 拦截器不得原地修改传入的 Event；必须返回新对象（或返回 `null` 取消事件）。
3. **可扩展 (Extensibility)**: 常见机制必须支持数据驱动配置（DSL），只有少量“传奇机制”需要自定义 hooks。
4. **可调试 (Debuggability)**: 引擎必须支持回放/验算（记录 seed + trace），并提供事件预算防止无限连锁。

### 1. 基础数据结构 (Data Structures)

#### 1.0 通用类型 (Shared Types)
```typescript
type BaseStats = {
  STR: number;
  AGI: number;
  VIT: number;
  LUK: number; // 玩家面板幸运：内部可映射为 EventLuck/CombatLuck 两条曲线
};

type ModifierSource = 'PASSIVE' | 'EQUIP' | 'BUFF' | 'ENV' | 'TALENT';

// 统一的战斗标签（用于结算规则与文案模板）
type CombatTag =
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

type StackPolicy = 'STACK' | 'REFRESH_DURATION' | 'REPLACE' | 'IGNORE';

type ModifierStacking = {
  stackKey: string;      // 同类识别键（同 key 的 Modifier 视为“同类”）
  policy: StackPolicy;   // 叠加策略
  maxStacks?: number;    // STACK 时有效
};
```

#### 1.1 战斗单位 (Unit)
```typescript
interface Unit {
  id: string;      // 运行时唯一ID
  name: string;    // 显示名称
  // 面板属性 (Base Stats + Static Modifiers)
  stats: BaseStats;
  // 运行时状态
  state: {
    hp: number;    // 当前血量
    maxHp: number; // 最大血量
    cd: Record<string, number>; // 技能冷却 { skillId: remainingRounds }
  };
  // 挂载的所有修饰器
  modifiers: Modifier[]; 
}
```

#### 1.2 修饰器 (Modifier)
所有扩展内容的基类。
```typescript
interface Modifier {
  id: string;
  source: ModifierSource;
  name: string;
  description?: string;

  // --- 确定性与叠加规则 ---
  // priority 越高越先执行（拦截器/反应器均遵守）
  // 同 priority 时使用 appliedOrder（挂载顺序）保证稳定
  priority?: number;        // default: 0
  appliedOrder?: number;    // 引擎在挂载时写入（递增）
  stacking?: ModifierStacking;
  
  // 静态属性修正: 直接加算到面板
  // e.g. { STR: 10 }
  statBonus?: Partial<BaseStats>; 
  
  // 动态逻辑钩子
  hooks?: ModifierHooks;

  // 生命周期管理
  duration?: number; // -1: 永久, >0: 剩余回合数
  tags?: CombatTag[];
}
```

#### 1.3 逻辑钩子 (ModifierHooks)
```typescript
interface ModifierHooks {
  // --- 生命周期钩子 ---
  onRoundStart?: (ctx: TriggerContext) => void;
  onTurnStart?: (ctx: TriggerContext) => void;
  onTurnEnd?: (ctx: TriggerContext) => void;

  // --- 管道拦截器 (Interceptors) ---
  // 有权修改 Event 的 payload
  // 返回修改后的 Event，或者 null (取消事件)
  onOutgoing?: (event: CombatEvent, ctx: InteractionContext) => CombatEvent | null;
  onIncoming?: (event: CombatEvent, ctx: InteractionContext) => CombatEvent | null;
  
  // --- 管道反应器 (Reactors) ---
  // 事件结算后触发，返回一组新的衍生事件
  onPostAction?: (event: CombatEvent, ctx: InteractionContext) => CombatEvent[];
}
```

### 2. 事件系统 (Event System)

#### 2.1 事件定义 (CombatEvent)
```typescript
interface CombatEvent {
  id: string; // 运行时唯一ID（用于回放/去重/溯源）
  type: 'ATTACK' | 'HEAL' | 'APPLY_BUFF' | 'REMOVE_BUFF' | 'DEATH';
  sourceId: string; // 发起者
  targetId: string; // 承受者

  // 事件发生的时间戳（用于确定性排序与日志定位）
  meta: {
    round: number;
    turn: number;
    seq: number; // 同一 turn 内的事件序号（递增）
  };
  
  // 事件携带的数据
  payload: Readonly<{
    value?: number;       // 伤害/治疗量
    modifier?: Modifier;  // 施加的Buff对象
    tags: CombatTag[];    // 标签: ['physical', 'crit', 'miss']

    // 建议：不要依赖 isCrit/isMiss 作为“真相”，它们应由 tags 推导
    // 仅用于性能优化或日志渲染快捷路径
    isCrit?: boolean;
    isMiss?: boolean;
  }>;

  depth: number; // 递归深度 (防止死循环)
  parentId?: string; // 父事件ID (用于溯源)
}
```

### 3. 核心接口 (Core Interfaces)

#### 3.1 职业 (Class)
```typescript
interface CharacterClass {
  id: string;
  name: string;
  // 基础属性模版
  baseStats: BaseStats;
  // 职业天赋 (作为 Modifiers 存在)
  talents: Modifier[]; 
}
```

#### 3.2 装备 (Equipment)
```typescript
interface Equipment extends Modifier {
  source: 'EQUIP';
  slot: 'WEAPON' | 'ARMOR' | 'ACCESSORY';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}
```

### 4. 规则与确定性 (Rules & Determinism)

#### 4.1 Hooks 的确定性执行顺序 (Deterministic Hook Order)
拦截器顺序若不固定，会直接破坏“同 seed 可复现”。因此引擎规定：

1. **所有参与者的 Modifiers 收集顺序固定**
   - `ENV`（战场环境）
   - `source`（发起者身上）
   - `target`（承受者身上）

2. **同一参与者内的排序规则固定**
   - 按 `priority` **降序**
   - 再按 `appliedOrder` **升序**（先挂载的先执行）
   - 再按 `id` **字典序**（兜底稳定排序）

3. **Phase 1（拦截）中的执行顺序**
   - 先跑 `source.onOutgoing`
   - 再跑 `target.onIncoming`
   - `ENV` 既可以作为“最先”也可以作为“最后”，但必须固定（建议：拦截阶段 ENV 最先，反应阶段 ENV 最后）

> 约束：拦截器不得“原地修改 event”，必须返回新 event；否则同一个 event 引用可能被多个 modifier 交叉污染。

#### 4.2 Modifier 冲突与叠加 (Stacking & Conflict)
所有可叠加对象必须声明 `stacking`：

- `STACK`: 叠加层数（可设置 `maxStacks`）。
- `REFRESH_DURATION`: 不叠层，重复施加只刷新持续时间。
- `REPLACE`: 新的覆盖旧的（旧的移除）。
- `IGNORE`: 若已存在则忽略。

默认策略（建议，避免意外爆炸）：
- `BUFF/DEBUFF` 默认 `REFRESH_DURATION`
- `EQUIP` 默认 `IGNORE`（同 slot 由装备系统保证唯一）
- `ENV` 默认 `REPLACE`

#### 4.3 Duration 的递减时机 (Duration Tick)
为避免“回合开始/结束”口径不一致导致调试困难，引擎固定：

- `duration` 在 **onRoundEnd** 统一递减。
- 当 `duration` 递减到 `0` 时，在回合结束结算中移除。
- `duration = -1` 表示永久。

#### 4.4 CombatTag 口径 (Tag Semantics)
标签不仅用于文案，更是结算规则的“合同”。以下规则必须统一：

- `physical` / `magic` / `true_damage` 三者互斥（必须且只能有其一，除非事件不造成数值变化）。
- `crit`、`miss` 为结果标签：
  - 若 `miss` 存在，则本次伤害最终应为 `0`（同时可添加 `immune` 表达免疫）。
  - 若 `crit` 存在，则必须明确暴击倍率来源（职业/装备/天赋/默认倍率）。
- `reflect` 表示来源为反伤；`dot` 表示持续伤害（通常不触发部分“普攻触发器”，除非显式声明）。

#### 4.5 LUK 的两曲线与软上限 (EventLuck vs CombatLuck)
玩家面板仍只有 `LUK`，但所有概率结算使用内部映射：

- `EventLuck = f(LUK)`：用于事件/掉落。
- `CombatLuck = g(LUK)`：用于战斗概率偏置。

建议约束（示例口径，便于实现）：

- 概率偏置采用软上限：`bias = maxBias * (1 - exp(-LUK / k))`
  - EventLuck: `maxBias` 可更大（例如 0.25），CombatLuck 更小（例如 0.08）
- 最终概率：`p' = clamp(p + bias, pMin, pMax)`
  - `pMin`、`pMax` 用于防止“绝对不触发/绝对触发”（例如 0.01~0.99）

> 上述是规范口径；最终参数 `k/maxBias/pMin/pMax` 由平衡测试决定。

### 5. 事件预算与去重 (Event Budget & Dedup)
仅靠 `depth` 防死循环会“截断机制”，因此引擎增加“预算”约束：

```typescript
type EngineLimits = {
  maxEventDepth: number;           // 单条因果链最大深度
  maxEventsPerRound: number;       // 单回合最大事件数
  maxDerivedEventsPerEvent: number;// 单事件最多衍生事件数
  maxTriggersPerModifierPerRound: number; // 单 modifier 每回合最多触发次数
};

type DedupKey = string;
```

去重建议：在同一因果链（同 `parentId` 根）内，构造 dedupKey（type/source/target/tags/stackKey/round/turn）并缓存；重复事件直接丢弃或降级为日志提示。

### 6. 回放与验算 (Replay & Verification)
已采用 seeded RNG 时，回放能力应“顺手做出来”，用于调平衡与定位 bug：

- **必须记录**: 初始 seed、引擎版本、初始单位快照（序列化）、以及每次 RNG 消耗点（第 N 次调用、调用来源 label）。
- **建议记录**: 每个事件的前后状态差（diff），以及每个拦截器对事件的修改（event diff + modifierId）。

示例结构：
```typescript
type ReplayRecord = {
  engineVersion: string;
  seed: string;
  initialState: unknown;
  rngTrace: Array<{ n: number; label: string; value: number }>;
  eventTrace: Array<{ eventId: string; parentId?: string; type: string; meta: { round: number; turn: number; seq: number }; tags: CombatTag[] }>;
};
```

### 7. 数据驱动 DSL（内容量产层）(Content DSL Draft)
若所有技能都写 hooks，产能会卡死；因此引擎提供“声明式效果层”，覆盖 80% 常见内容：

```typescript
type ValueExpr =
  | { type: 'FLAT'; value: number }
  | { type: 'SCALE'; stat: keyof BaseStats; ratio: number }
  // 取触发当前 effect 的“上下文事件”的数值（通常是事件的 payload.value）
  | { type: 'EVENT_VALUE' };

type TargetSelector = 'SELF' | 'SOURCE' | 'TARGET';
type EventEffectTarget = TargetSelector | 'ALL';

type EventWhen = {
  role?: 'SOURCE' | 'TARGET';
  eventType?: CombatEvent['type'];
  hasTag?: CombatTag;
  // 可选：排除标签（例如 lifesteal 不吃 true_damage/reflect/miss）
  notHasTag?: CombatTag;      // 单个排除（便捷）
  notHasTags?: CombatTag[];   // 多个排除（推荐）
};

// 当前实现采用开放 EffectSpec：引擎核心不维护封闭 union
type EffectSpec = {
  kind: string;
  target?: EventEffectTarget;
  [key: string]: unknown;
};

// 当前内置 standardEffectHandlers 支持的 kind
type BuiltinEffectSpec =
  | { kind: 'APPLY_MODIFIER'; target?: EventEffectTarget; modifierId?: string; modifier?: Modifier; duration?: number; textOverrides?: Modifier['texts'] }
  | { kind: 'TRIGGER_EVENT_POOL'; poolId: string }
  | { kind: 'SHIELD'; value: ValueExpr[]; tags: CombatTag[] }
  | { kind: 'LIFESTEAL'; ratio: number; tags: CombatTag[] }
  | { kind: 'DISPEL'; target: TargetSelector; mode: 'BUFF' | 'DEBUFF' | 'ANY'; byTag?: CombatTag; max?: number }
  | { kind: 'MITIGATE'; when: EventWhen; multiplier: number; min?: number }
  | { kind: 'DIRECT_DAMAGE'; target: EventEffectTarget; value: number; tags?: CombatTag[] }
  | { kind: 'DIRECT_HEAL'; target: EventEffectTarget; value: number; tags?: CombatTag[] }
  | { kind: 'GRANT_CONSUMABLE'; target: EventEffectTarget; consumableId: string }
  | { kind: 'GRANT_RANDOM_CONSUMABLE'; target: EventEffectTarget }
  | { kind: 'LOSE_RANDOM_CONSUMABLE'; target: EventEffectTarget; count?: number }
  | { kind: 'GRANT_EQUIPMENT'; target: EventEffectTarget; equipment: Modifier }
  | { kind: 'GRANT_RANDOM_EQUIPMENT'; target: EventEffectTarget; slot?: 'WEAPON' | 'ARMOR' | 'ACCESSORY' }
  | { kind: 'LOSE_RANDOM_EQUIPMENT'; target: EventEffectTarget; slot?: 'WEAPON' | 'ARMOR' | 'ACCESSORY' };

type TriggerSpec =
  | { on: 'ROUND_START' }
  | { on: 'TURN_START' }
  // 拦截阶段触发：用于“改事件”的效果（例如减伤、免疫、改标签）
  // 语义：发生在 Phase 1 Interception 中，结算前生效
  | { on: 'PIPELINE_INCOMING'; when?: EventWhen }
  | { on: 'PIPELINE_OUTGOING'; when?: EventWhen }
  | { on: 'POST_ACTION'; when?: EventWhen }
  // 普攻触发：当自己成功造成/承受一次攻击后触发（属于 POST_ACTION 的常用语义糖）
  | { on: 'ON_HIT'; when?: Omit<EventWhen, 'eventType'> }
  | { on: 'ON_HURT'; when?: Omit<EventWhen, 'eventType'> };

type ModifierSpec = {
  id: string;
  source: ModifierSource;
  name: string;
  description?: string;
  priority?: number;
  duration?: number;
  tags?: CombatTag[];
  stacking?: ModifierStacking;
  statBonus?: Partial<BaseStats>;
  triggers?: Array<{ trigger: TriggerSpec; effects: EffectSpec[] }>;

  // 兜底逃生舱：少量“传奇机制”仍可用 hooks 手写
  hooks?: ModifierHooks;
};

// --- 事件池（用于环境随机事件、召唤物行为、AI 行动等）---
type EventPoolEntry = {
  id: string;
  name: string;
  weight: number;
  // 命中后执行的效果（可直接复用 EffectSpec）
  effects: EffectSpec[];
  // 可选：触发条件（例如只在第 N 回合后）
  condition?: TriggerCondition;
};

type EventPoolSpec = {
  id: string;
  domain: 'EVENT' | 'COMBAT';
  entries: EventPoolEntry[];
};
```

当前实现补充：

- `TRIGGER_EVENT_POOL` 内置 handler 只消费 `poolId`，触发 owner 固定为当前 `owner`。
- 随机装备来源于 `bootstrap.equipmentPoolIds`；可通过 `slot` 过滤候选。
- `EngineRuntime.state` 已提供：`grantRandomItem` / `loseRandomItem` / `loseConsumable` / `loseEquipment`，用于内容侧自定义 executor 或自定义 handler 组合。

> 约束：同一 Modifier 不应同时声明“会改变事件结果”的 hooks 与同类 DSL effects，除非明确优先级与目的（否则难以调试）。

#### 7.1 最小可用常见效果清单 (MVP Effect Catalog)
以下效果覆盖你要求的“纯 JSON 量产”常见机制：

- **吸血**: `LIFESTEAL`（配合 `POST_ACTION` + `when.role='SOURCE'` + `when.eventType='ATTACK'`）
- **减伤**: `MITIGATE`（配合 `onIncoming` 的 DSL 化封装）
- **加盾**: `SHIELD`
- **驱散**: `DISPEL`
- **控制**: 用 `APPLY_MODIFIER` 应用一个“眩晕/沉默”等控制 Modifier（控制本身是 Modifier）
- **普攻触发**: `ON_HIT` / `ON_HURT`（语义糖，最终落到 POST_ACTION）
- **事件池加权**: `TRIGGER_EVENT_POOL` + `EventPoolSpec`

#### 7.2 纯 JSON 示例（可直接给内容策划用）

1) **[吸血]：造成伤害后回复 30%（不吃反伤/真实伤害）**
```json
{
  "id": "talent.lifesteal_30",
  "source": "TALENT",
  "name": "嗜血本能",
  "priority": 0,
  "tags": ["talent"],
  "stacking": { "stackKey": "talent.lifesteal", "policy": "REPLACE" },
  "triggers": [
    {
      "trigger": { "on": "POST_ACTION", "when": { "role": "SOURCE", "eventType": "ATTACK", "notHasTags": ["miss", "true_damage", "reflect"] } },
      "effects": [
        { "kind": "LIFESTEAL", "ratio": 0.3, "tags": ["heal"] }
      ]
    }
  ]
}
```

2) **[减伤 Buff]：受到 physical 攻击时伤害 *0.7（最低减到 1）**
```json
{
  "id": "buff.guard_30",
  "source": "BUFF",
  "name": "架势",
  "duration": 2,
  "priority": 10,
  "tags": ["buff"],
  "stacking": { "stackKey": "buff.guard", "policy": "REFRESH_DURATION" },
  "triggers": [
    {
      "trigger": { "on": "PIPELINE_INCOMING", "when": { "role": "TARGET", "eventType": "ATTACK", "hasTag": "physical" } },
      "effects": [
        { "kind": "MITIGATE", "when": { "role": "TARGET", "eventType": "ATTACK", "hasTag": "physical" }, "multiplier": 0.7, "min": 1 }
      ]
    }
  ]
}
```
> 注：`MITIGATE` 属于“拦截阶段改事件”，必须用 `PIPELINE_INCOMING/PIPELINE_OUTGOING` 触发，保证在结算前生效。

3) **[加盾]：回合开始获得护盾（STR*0.5 + 10）**
```json
{
  "id": "buff.shield_start",
  "source": "BUFF",
  "name": "金钟罩",
  "duration": 3,
  "priority": 0,
  "tags": ["buff", "shield"],
  "stacking": { "stackKey": "buff.shield", "policy": "REFRESH_DURATION" },
  "triggers": [
    {
      "trigger": { "on": "ROUND_START" },
      "effects": [
        {
          "kind": "SHIELD",
          "value": [
            { "type": "SCALE", "stat": "STR", "ratio": 0.5 },
            { "type": "FLAT", "value": 10 }
          ],
          "tags": ["shield"]
        }
      ]
    }
  ]
}
```

4) **[驱散]：普攻命中后驱散对手 1 个 Buff**
```json
{
  "id": "talent.dispel_on_hit",
  "source": "TALENT",
  "name": "破法一击",
  "priority": 0,
  "tags": ["talent"],
  "triggers": [
    {
      "trigger": { "on": "ON_HIT", "when": { "role": "SOURCE", "hasTag": "physical", "notHasTag": "miss" } },
      "effects": [
        { "kind": "DISPEL", "target": "TARGET", "mode": "BUFF", "max": 1 }
      ]
    }
  ]
}
```

5) **[控制]：命中后附加“眩晕”1 回合（控制是 Modifier）**
```json
{
  "id": "skill.stun_strike",
  "source": "TALENT",
  "name": "当场愣住",
  "priority": 0,
  "tags": ["control"],
  "triggers": [
    {
      "trigger": { "on": "ON_HIT", "when": { "role": "SOURCE", "notHasTag": "miss" } },
      "effects": [
        { "kind": "APPLY_MODIFIER", "modifierId": "debuff.stun", "duration": 1 }
      ]
    }
  ]
}
```

6) **[事件池加权]：按阶段从对应事件池抽取执行**
```json
{
  "id": "env.roundstart_events",
  "source": "ENV",
  "name": "今天也不太平",
  "priority": 0,
  "tags": ["env"],
  "triggers": [
    {
      "trigger": { "on": "ROUND_START" },
      "effects": [
        { "kind": "TRIGGER_EVENT_POOL", "poolId": "pool.round.global" }
      ]
    }
  ]
}
```

事件池定义：
```json
{
  "id": "pool.round.global",
  "domain": "EVENT",
  "entries": [
    {
      "id": "event.nat",
      "name": "临时线下开会",
      "weight": 8,
      "effects": [
        { "kind": "APPLY_MODIFIER", "target": "ALL", "modifier": "<inline_modifier>", "duration": 1 }
      ]
    },
    {
      "id": "event.meltdown",
      "name": "热搜情绪崩盘",
      "weight": 8,
      "effects": [
        { "kind": "APPLY_MODIFIER", "target": "ALL", "modifier": "<inline_modifier>", "duration": 2 }
      ]
    }
  ]
}
```

---

## Part 3: 扩展实现案例 (Implementation Examples)

以下案例展示了如何利用上述架构实现复杂机制。

### Case 1: [荆棘甲] (装备)
**机制**: 受到攻击时，反弹 30% 伤害给攻击者。
- **类型**: `Modifier` (Source: EQUIP)
- **Hook**: `onPostAction` (反应器)
- **逻辑**:
  ```typescript
  onPostAction: (event, ctx) => {
    // 1. 只有当自己是受害者，且事件类型是受伤时触发
    if (event.targetId === ctx.owner.id && event.type === 'ATTACK') {
      // 2. 生成反伤事件
      return [{
        type: 'ATTACK',
        sourceId: ctx.owner.id,
        targetId: event.sourceId, // 反弹给攻击者
        payload: {
          value: event.payload.value * 0.3,
          tags: ['reflect', 'true_damage'] // 真实伤害
        }
      }];
    }
    return [];
  }
  ```

### Case 2: [虚无形态] (Buff)
**机制**: 免疫所有物理伤害，但受到的魔法伤害加倍。
- **类型**: `Modifier` (Source: BUFF)
- **Hook**: `onIncoming` (拦截器)
- **逻辑**:
  ```typescript
  onIncoming: (event, ctx) => {
    if (event.type !== 'ATTACK') return event;

    // 物理免疫
    if (event.payload.tags.includes('physical')) {
      event.payload.value = 0;
      event.payload.tags.push('immune');
    }
    // 魔法易伤
    if (event.payload.tags.includes('magic')) {
      event.payload.value *= 2.0;
    }
    return event;
  }
  ```

### Case 3: [时光倒流] (消耗品)
**机制**: 战斗回退到上一回合开始时。
- **类型**: 直接调用引擎 API
- **逻辑**:
  ```typescript
  function execute(engine: GameEngine) {
    const previousSnapshot = engine.history.pop();
    if (previousSnapshot) {
      engine.state = previousSnapshot;
      engine.log("时间发生了倒流...");
    }
  }
  ```

---

## Part 4: 随机性与决策系统 (Randomness & Decision System)

本章节定义了如何通过种子确保随机性，并处理非均匀概率的决策。

### 1. 随机数生成器 (RNG Interface)
所有概率判断必须通过此接口，严禁使用 `Math.random()`。

```typescript
interface RNG {
  // 基础随机
  next(): number; // [0, 1)
  range(min: number, max: number): number; // [min, max]
  
  // 概率判断
  // 概率判断（带幸运偏置）
  // - chance: 基础概率 [0,1]
  // - luck: 用于把 LUK 映射为“软上限偏置”（EventLuck/CombatLuck）
  bool(chance: number, luck?: { domain: 'EVENT' | 'COMBAT'; luk: number }): boolean;
  
  // 加权随机 (用于事件池、AI决策)
  // weights: { 'optionA': 10, 'optionB': 50 } -> OptionB 被选中的概率是 OptionA 的 5倍
  weightedPick<T>(options: T[], weights: (item: T) => number): T;
}
```

### 2. 行动决策 (Decision Making)
AI 的行动不是完全随机的，而是基于当前状态的 **加权随机 (Weighted Randomness)**。

- **逻辑**:
  1. 获取所有可用 Action (普攻、技能A、道具B)。
  2. 计算每个 Action 的 **权重 (Weight)**。
     - *HP > 80%*: 攻击技能权重 +50，治疗权重 -50。
     - *HP < 30%*: 治疗/逃跑权重 +100。
  3. 使用 `rng.weightedPick` 选择最终行动。

### 3. 条件触发 (Conditional Triggers)
支持“必定触发”与“概率触发”的混合逻辑。

```typescript
interface TriggerCondition {
  type: 'ALWAYS' | 'CHANCE' | 'HP_BELOW' | 'HAS_BUFF';
  value?: number; // 概率值(0-1) 或 HP阈值
}

// 引擎辅助函数
function checkCondition(condition: TriggerCondition, ctx: Context): boolean {
  switch (condition.type) {
    case 'ALWAYS': return true;
    case 'CHANCE':
      // 条件触发通常属于“战斗域”（除非该 condition 明确用于随机事件域）
      return ctx.rng.bool(condition.value, { domain: 'COMBAT', luk: ctx.owner.stats.LUK });
    case 'HP_BELOW': return (ctx.owner.hp / ctx.owner.maxHp) < condition.value;
    default: return false;
  }
}

```
