# 姓名大作战 - 内容定义规范 (Content Specification)

> 版本: 0.1 (MVP)
> 
> 适用范围: `src/content/**` 全部内容资产（职业、装备、Modifier、事件池、消耗品、文案）

---

## 1. 目标与原则

本规范用于约束“内容层”开发，确保：

- **可扩展**：新增内容只需“新建单文件 + 在对应 `index.ts` 注册”，不改引擎核心。
- **可复用**：基础类型统一定义在 `src/content/base`。
- **可维护**：每个实现独立文件，避免大文件冲突。
- **可验证**：Modifier 在注册时进行字段与 `tag` 校验。
- **可复现**：内容执行依赖引擎的确定性排序与 seeded RNG。

### 1.1 文案风格约定（必读）

本项目文案默认采用：**现实类 / 恶搞类 / 搞笑类 / 游戏梗 / 动漫梗 / 新闻梗** 风格（国内外均可）。

- 鼓励：互联网语境、热点隐喻、轻度吐槽、反差幽默
- 避免：传统魔幻、咒语腔、DND 史诗叙事（除非某个内容包明确主题化）
- Emoji：可少量点缀（建议每条文案 0~1 个），避免全句刷 emoji 影响可读性
- 文案必须尊重变量占位符（如 `{sourceName}`、`{amount}`），不得删除关键参数位
- 默认模板保持中性通用；具体梗文案优先写在具体内容对象并走覆盖机制

---

## 2. 目录架构设计

```text
src/content/
├─ base/
│  ├─ characterClass.ts      # 职业基础类型
│  ├─ consumable.ts          # 消耗品基础类型
│  ├─ equipment.ts           # 装备基础类型
│  ├─ text.ts                # 文本模板系统（模板渲染/候选随机）
│  └─ modifier.ts            # Modifier 校验逻辑（validateModifierSpec）
├─ classes/
│  ├─ brawler.ts             # 单个职业实现
│  ├─ sustainer.ts
│  └─ index.ts               # 职业注册（allClasses -> classes）
├─ equipment/
│  ├─ keyboard.ts            # 单个武器实现
│  ├─ thorns.ts              # 单个防具实现
│  └─ index.ts               # 装备注册 + cloneEquipment
├─ consumables/
│  ├─ adrenalineShot.ts      # 单个消耗品实现
│  └─ index.ts               # 消耗品注册
├─ modifiers/
│  ├─ buffs/
│  ├─ debuffs/
│  ├─ env/
│  ├─ talents/
│  └─ index.ts               # 仅保留扩展入口（当前默认内联）
├─ events/
│  ├─ entries/
│  │  ├─ nat.ts              # 单个事件条目
│  │  └─ meltdown.ts
│  ├─ pools/
│  │  ├─ round.global.ts     # 回合阶段池（全员/随机单人事件）
│  │  └─ turn.personal.ts    # 行动阶段池（触发人个人事件）
│  └─ index.ts               # eventPools 注册（allPools）
├─ narration.ts              # 文案模板与渲染
└─ index.ts                  # content 聚合导出
```

---

## 3. 内容系统与引擎关系

- 内容通过 `src/content/index.ts` 导出给引擎使用。
- 引擎通过 **依赖倒置接口** `src/engine/contentAdapter.ts` 与内容层交互。
- 默认实现为 `src/content/battleContentAdapter.ts`。

### 3.1 依赖倒置接口（关键）

`engine` 只依赖 `BattleContentAdapter`，不依赖具体 `content` 实现：

- `bootstrap(input)` 返回：
  - `units`
  - `envModifiers`
  - `eventPools`
  - `scheduleRules`
  - `narrate`
  - `logText`
  - `createModifierById`

这样可替换为任意实现（MVP 内容包、活动内容包、测试 mock 内容包），无需修改引擎核心。

### 3.3 日志文案定义模式（Content-Driven Logs）

`engine` 只负责“何时记日志、记录哪些结构化字段（round/turn/actor/eventType）”，不负责具体中文文本。

- 攻击类战报：由 `narrate` 负责（含同义句池/风格）
- 系统类战报通过 `logText(key, variables, rngValue)` 渲染：
  - `engine` 负责传递 key 与结构化变量（source/target/modifier/event）
  - `content` 决定具体文本模板（固定或候选池）
  - 可按 sourceId/sourceType 回溯到具体内容对象（如 Consumable/Event/Modifier）

这样同一机制可以在不同 content 包里使用不同文案风格，而无需改引擎流程代码。

### 3.2 默认装配策略（可复现随机）

默认 `contentAdapter` 的装配规则分为两层：

- **身份层（只由 name 决定）**
  - 初始属性（STR/AGI/VIT/LUK）
  - 初始职业
  - 初始 modifier（非装备类）
- **装备层（由 name + seed 决定）**
  - 初始装备
  - 初始道具

约束：

- 同 `name` 的身份层必须稳定一致
- 同 `name + seed` 的装备层必须稳定一致
- 战斗过程随机性由 battle seed 驱动

---

## 4. 核心接口与参数定义

以下为内容层必须理解的关键接口（来源：`src/engine/types.ts` + `src/content/base/*`）。

### 4.1 基础属性与标签

```ts
type BaseStats = {
  STR: number; // 力量：影响物理攻击
  AGI: number; // 敏捷：影响出手顺序
  VIT: number; // 体质：影响最大生命值
  LUK: number; // 幸运：影响概率判定
};

type CombatTag =
  | 'physical' | 'magic' | 'true_damage'
  | 'heal' | 'shield' | 'dot'
  | 'control' | 'reflect'
  | 'crit' | 'miss' | 'immune'
  | 'buff' | 'debuff' | 'env' | 'talent' | 'equip';
```

### 4.1.1 核心可修改属性清单 (Engine Capabilities)

内容层可通过 `Modifier.statBonus` 或 `Effect` 修改以下属性与状态：

- **面板属性 (BaseStats)**: `STR`, `AGI`, `VIT`, `LUK` (通过 `statBonus` 修正)
- **生命值 (HP)**: 通过 `DIRECT_DAMAGE` / `DIRECT_HEAL` / `LIFESTEAL` 修改
- **护盾 (Shield)**: 通过 `SHIELD` effect 增加 (引擎原生支持护盾机制)
- **控制 (Control)**: 通过施加带有 `control` 标签的 Modifier (如 `tags: ['debuff', 'control']`) 可跳过目标回合
- **物品 (Items)**: 通过 `GRANT/LOSE` 效果增删消耗品与装备

### 4.2 Modifier 相关

```ts
type ModifierSource = 'PASSIVE' | 'EQUIP' | 'BUFF' | 'ENV' | 'TALENT';

type ModifierStacking = {
  stackKey: string;
  policy: 'STACK' | 'REFRESH_DURATION' | 'REPLACE' | 'IGNORE';
  maxStacks?: number;
};

type ModifierSpec = {
  id: string;
  source: ModifierSource;
  name: string;
  description?: string;
  texts?: {
    apply?: string | string[];
    remove?: string | string[];
    trigger?: string | string[];
    triggerByTag?: Partial<Record<CombatTag, string | string[]>>;
    tick?: string | string[];
  };
  priority?: number;
  duration?: number;                  // -1 永久，>0 回合数
  tags?: CombatTag[];
  stacking?: ModifierStacking;
  statBonus?: Partial<BaseStats>;
  triggers?: Array<{ trigger: TriggerSpec; effects: EffectSpec[] }>;
  hooks?: ModifierHooks;              // 复杂机制兜底
};
```

#### TriggerSpec（触发时机）

```ts
type TriggerSpec =
  | { on: 'ROUND_START' }
  | { on: 'TURN_START' }
  | { on: 'PIPELINE_INCOMING'; when?: EventWhen }
  | { on: 'PIPELINE_OUTGOING'; when?: EventWhen }
  | { on: 'POST_ACTION'; when?: EventWhen }
  | { on: 'ON_HIT'; when?: Omit<EventWhen, 'eventType'> }
  | { on: 'ON_HURT'; when?: Omit<EventWhen, 'eventType'> };
```

#### EffectSpec（DSL 效果）

```ts
type EffectSpec = {
  kind: string;
  target?: 'SELF' | 'SOURCE' | 'TARGET' | 'ALL';
  [key: string]: unknown;
};
```

当前实现里，`engine` 对 `EffectSpec` 采用**开放结构**（`kind: string`），核心不再维护封闭 union。

内置 `standardEffectHandlers` 当前支持的 kind（MVP）：

```ts
type BuiltinEffectSpec =
  | { kind: 'APPLY_MODIFIER'; target?: 'SELF'|'SOURCE'|'TARGET'|'ALL'; modifierId?: string; modifier?: Modifier; duration?: number; textOverrides?: Modifier['texts'] }
  | { kind: 'TRIGGER_EVENT_POOL'; poolId: string }
  | { kind: 'SHIELD'; value: ValueExpr[]; tags: CombatTag[] }
  | { kind: 'LIFESTEAL'; ratio: number; tags: CombatTag[] }
  | { kind: 'DISPEL'; target: 'SELF'|'SOURCE'|'TARGET'; mode: 'BUFF'|'DEBUFF'|'ANY'; byTag?: CombatTag; max?: number }
  | { kind: 'MITIGATE'; when: EventWhen; multiplier: number; min?: number }
  | { kind: 'DIRECT_DAMAGE'; target: 'SELF'|'SOURCE'|'TARGET'|'ALL'; value: number; tags?: CombatTag[] }
  | { kind: 'DIRECT_HEAL'; target: 'SELF'|'SOURCE'|'TARGET'|'ALL'; value: number; tags?: CombatTag[] }
  | { kind: 'GRANT_CONSUMABLE'; target: 'SELF'|'SOURCE'|'TARGET'|'ALL'; consumableId: string }
  | { kind: 'GRANT_RANDOM_CONSUMABLE'; target: 'SELF'|'SOURCE'|'TARGET'|'ALL' }
  | { kind: 'LOSE_RANDOM_CONSUMABLE'; target: 'SELF'|'SOURCE'|'TARGET'|'ALL'; count?: number }
  | { kind: 'GRANT_EQUIPMENT'; target: 'SELF'|'SOURCE'|'TARGET'|'ALL'; equipment: Modifier }
  | { kind: 'GRANT_RANDOM_EQUIPMENT'; target: 'SELF'|'SOURCE'|'TARGET'|'ALL'; slot?: 'WEAPON'|'ARMOR'|'ACCESSORY' }
  | { kind: 'LOSE_RANDOM_EQUIPMENT'; target: 'SELF'|'SOURCE'|'TARGET'|'ALL'; slot?: 'WEAPON'|'ARMOR'|'ACCESSORY' };
```

说明：

- 对于未知 `kind`，若未在 `effectHandlers` 注册，将在运行时抛错。
- `GRANT_RANDOM_EQUIPMENT` 的随机来源是 `bootstrap.equipmentPoolIds`，可通过 `slot` 限定槽位。
- 额外字段（例如旧写法里自定义的 `equipments`）不会被内置 handler 消费，除非你提供自定义 handler。

`APPLY_MODIFIER.textOverrides` 用于“调用方场景化改写文案”：

- Modifier 中的 `texts` 是默认通用 fallback
- 事件/道具/其他 effect 触发同一 modifier 时，可在 `textOverrides` 定义本次触发的专属文案
- 优先级：`effect.textOverrides` > `modifier.texts` > 系统默认文案

推荐策略：

- 若效果与具体事件/道具强绑定且无复用预期：优先 `modifier` 内联定义（单文件完成）
- 若效果在多个内容间复用：再考虑抽到 `modifiers/index.ts` 统一管理

### 4.3.1 掉落与容量规则（Roguelike 风格）

- 道具拾取通过事件 effect `GRANT_CONSUMABLE` 触发
- 每个单位道具栏上限固定为 `3`（引擎内置策略），满了后新道具入包并挤掉最早的一个
- 装备拾取通过事件 effect `GRANT_EQUIPMENT` 触发
- 装备按槽位唯一：同槽位新装备自动替换旧装备（当前槽位集合：`WEAPON` / `ARMOR` / `ACCESSORY`）
- 事件可通过 `DIRECT_DAMAGE` / `DIRECT_HEAL` 直接改动血量，也可用 `APPLY_MODIFIER` 施加临时 buff/debuff
- 拾取类事件优先用随机机制：`GRANT_RANDOM_CONSUMABLE` / `GRANT_RANDOM_EQUIPMENT`
- 丢失类事件优先用随机机制：`LOSE_RANDOM_CONSUMABLE` / `LOSE_RANDOM_EQUIPMENT`

补充（当前 runtime 能力）：

- runtime 还提供 `state.grantRandomItem(target)` 与 `state.loseRandomItem(target)`（在“消耗品/装备”二者间随机）。
- runtime 还提供定向丢失：`state.loseConsumable(target, consumableId)`、`state.loseEquipment(target, equipmentId)`。
- 上述三项目前不是内置 effect kind，如需在内容 DSL 直接用，需注册自定义 effect handler。

### 4.3.2 事件触发时机与目标约定

- 回合池（`RoundStart`/`RoundEnd`）：用于全员影响或随机单人影响的环境事件
- 行动池（`TurnStart`/`TurnEnd`）：用于触发人个人事件（默认 `target: 'SELF'`）
- 设计建议：大多数事件应作用于触发人；全体事件作为低频“环境噪声”

### 4.3 职业/装备/消耗品/事件池

```ts
// base/characterClass.ts
type CharacterClass = {
  id: string;
  name: string;
  description?: string;
  baseStats: BaseStats;
  talents: Modifier[];
  texts?: {
    intro?: string | string[];
  };
};

// base/equipment.ts
type EquipmentLike = Modifier & {
  source: 'EQUIP';
  slot: 'WEAPON' | 'ARMOR' | 'ACCESSORY';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  texts?: {
    pickup?: string | string[];
    equip?: string | string[];
  };
};

// base/consumable.ts
type Consumable = {
  id: string;
  name: string;
  description: string;
  texts?: {
    use?: string | string[];
    trigger?: string | string[];
  };
};

// engine/types.ts
type EventPoolEntry = {
  id: string;
  name: string;
  weight: number;
  effects: EffectSpec[];
  texts?: {
    trigger?: string | string[];
    tick?: string | string[];
  };
};

type EventPoolSpec = {
  id: string;
  domain: 'EVENT' | 'COMBAT';
  entries: EventPoolEntry[];
};
```

### 4.4 字符串模板参数总表（重点）

模板引擎统一支持 `{变量名}` 占位符；当变量不存在时会渲染为空字符串。

#### A 通用参数（`logText` 默认都会注入）

- `round`：当前回合
- `turn`：当前回合内行动序号

#### B `narrate`（攻击战报）可用参数

- 基础：`source`、`target`、`value`
- 别名：`sourceName`、`targetName`、`damage`
- 身份：`sourceId`、`targetId`
- 事件：`eventId`、`eventType`、`round`、`turn`、`seq`、`depth`、`parentEventId`
- 标记：`isCrit`（0/1）、`isMiss`（0/1）、`tags`（逗号分隔）

补充（resolver 注入）：

- `createNarrationResolver` 的 `resolveTemplates` 允许返回：
  - `string[]`（仅覆盖模板）
  - `{ templates: string[]; variables?: Record<string, string|number|boolean|null|undefined> }`（覆盖模板并追加变量）
- `variables` 会与 `narrate` 默认变量合并后再渲染；用于给模板补充如 `modifierName`、`modifierId` 等上下文字段。

#### C `logText`（系统战报）常见参数

- 行动者：`actorId`、`actorName`
- 施加者：`sourceId`、`sourceName`、`sourceType`
- 目标：`targetId`、`targetName`
- 单位快照：`unitId`、`unitName`、`unitHp`、`unitMaxHp`、`unitShield`
- owner 快照：`ownerId`、`ownerName`、`ownerHp`、`ownerMaxHp`、`ownerShield`
- target 快照：`targetHp`、`targetMaxHp`、`targetShield`
- 数值：`amount`、`damage`、`healValue`、`shieldGained`
- Modifier：`modifierId`、`modifierName`、`modifierSource`、`modifierDuration`
- Event：`eventId`、`eventName`、`eventType`、`poolId`、`poolDomain`、`depth`、`parentEventId`

#### D 按系统 key 的额外参数约定

- `envEventTriggered` (事件触发时)
  - `eventName`、`actorName` (触发该事件的单位名，Global事件为"环境")
  - **注意**：此处无法使用 `{targetName}` (目标未定) 或 `{damage}`/`{healValue}` (数值未定)
- `rewind`
  - `roundBefore`、`roundAfter`
  - `itemName`（通常来自 consumable 名称）
- `gainShield`
  - `amount`、`shieldGained`
- `dispel`
  - `removedCount`
- `heal`
  - `hpBefore`、`hpAfter`
- `controlSkip`
  - `sourceType`、`sourceId`、`sourceName`（用于区分环境控制/天赋控制）

#### E `logText` key 与变量矩阵（速查）

> 说明：表中仅列“常用/关键”变量；实际渲染时仍可使用上文 C、D 小节的通用字段。

| key | 典型可用变量 | 备注 |
|---|---|---|
| `envEventTriggered` | `eventName`, `eventId`, `poolId`, `poolDomain`, `actorName`, `actorId`, `depth`, `parentEventId` | 触发阶段日志，通常不包含目标与最终伤害数值 |
| `useConsumable` | `unitName`, `unitId`, `sourceId`, `sourceName`, `itemName` | `sourceId` 通常为 consumable id |
| `pickupConsumable` / `dropConsumable` | `targetName`, `targetId`, `itemId`, `itemName` | 背包容量策略相关 |
| `pickupEquipment` / `dropEquipment` | `targetName`, `targetId`, `equipmentId`, `equipmentName` | 装备拾取/丢失 |
| `replaceEquipment` | `targetName`, `targetId`, `equipmentId`, `equipmentName`, `oldEquipmentId`, `oldEquipmentName` | 同槽替换 |
| `applyBuff` / `removeBuff` | `sourceName`, `sourceId`, `targetName`, `targetId`, `modifierName`, `modifierId`, `modifierSource`, `modifierDuration` | 状态施加/移除 |
| `heal` | `sourceName`, `sourceId`, `targetName`, `targetId`, `amount`, `healValue`, `hpBefore`, `hpAfter`, `targetMaxHp`, `targetShield` | 治疗结算日志 |
| `eventHeal` | `sourceName`, `sourceId`, `targetName`, `targetId`, `amount`, `healValue`, `hpBefore`, `hpAfter` | 环境/事件治疗语义 |
| `eventDamage` | `sourceName`, `sourceId`, `targetName`, `targetId`, `amount` | 环境/事件伤害语义 |
| `gainShield` | `ownerName`, `ownerId`, `amount`, `shieldGained`, `ownerShield` | 护盾增加 |
| `dispel` | `ownerName`, `ownerId`, `targetName`, `targetId`, `removedCount`, `sourceType`, `sourceId` | 装备来源可根据 `sourceType/sourceId` 回溯装备文案 |
| `controlSkip` | `unitName`, `unitId`, `sourceType`, `sourceId`, `sourceName` | 被控跳过行动 |
| `death` | `sourceName`, `sourceId`, `targetName`, `targetId`, `targetHp`, `targetMaxHp`, `targetShield` | 击杀结算 |
| `rewind` | `unitName`, `sourceType`, `sourceId`, `itemName`, `roundBefore`, `roundAfter` | 撤回/回放相关 |

#### F 模板编写建议

- **事件触发文案 (`texts.trigger`)**：
  - 个人事件（Personal Pool）：使用 `{actorName}` 指代触发者（即事件主角）。
  - 全局事件（Global Pool）：通常描述环境变化，避免指代特定个人（除非全是 ALL 效果）。
  - 避免在触发文案中写死动态数值（如 `{damage}`），因为此时伤害尚未计算。建议用定性描述或硬编码（如果数值固定）。
- **效果生效文案 (`textOverrides`)**：
  - 可完全使用 `{sourceName}`, `{targetName}`, `{amount}`, `{modifierName}` 等上下文变量。
- 推荐优先使用语义字段：`sourceName`、`targetName`、`modifierName`、`eventName`
- 数值类统一使用：`amount` / `damage` / `healValue` / `shieldGained`
- 需要可回放上下文时再用：`round`、`turn`、`eventId`
- 保持模板对缺省字段容错：某些 key 不会提供全部变量

---

## 5. 功能说明（按模块）

### 5.1 `base/`

- 提供跨内容类型共享的类型定义。
- `text.ts` 提供模板渲染能力：
  - 占位符替换：`{unitName}`、`{modifierName}` 等
  - 候选文本随机：`string[]` 按 seeded rng 值稳定抽取
- `modifier.ts` 提供 `validateModifierSpec(id, modifier)`：
  - 必须包含 `id/source/name`
  - `tags` 必须在允许集合内

### 5.2 `modifiers/`

- 当前策略：**默认全部内联定义**，`modifiers/` 仅保留目录与 `index.ts` 作为后续扩展入口。
- 当明确存在高复用能力（通常 >=3 处）时，再将定义上提到 `modifiers/`。

#### 5.2.1 解耦决策（避免过度设计）

- **高复用（>=3 处）**：做通用 modifier（放对应能力子目录）
- **中复用（2 处）**：保留通用 modifier，但允许调用方 `textOverrides` 覆盖文案
- **低复用（1 处，强场景绑定）**：可与事件/道具同域定义，不强制解耦

目标：优先保证内容迭代效率，再追求抽象纯度。

### 5.3 `events/`

- `entries/` 只描述单事件条目（id/name/weight/effects）。
- `pools/` 按触发阶段拆分管理（`round.global` / `turn.personal`）。
- `index.ts` 聚合 `allPools` 并导出 `eventPools`。

### 5.4 `classes/`

- 每个职业单文件。
- 每个职业建议先保持 1 个核心天赋，便于平衡与定位。
- 天赋优先在职业文件内联定义，先保证可读性与迭代速度。

### 5.5 `equipment/`

- 每件装备单文件。
- 特殊机制优先用 DSL，复杂行为可用 `hooks`。
- `cloneEquipment` 统一返回深拷贝实例，防止运行期污染配置对象。

### 5.6 `consumables/`

- 每个消耗品单文件。
- 本层定义静态元信息 + 文本模板（如 `texts.use`）。
- 执行逻辑由引擎/系统层控制，文案由内容层控制。
- 道具产出来源建议统一走随机事件掉落。

### 5.8 事件池概率与常用 10 事件

当前默认调度概率：

- `RoundStart` + `pool.round.global`: `0.28`
- `RoundEnd` + `pool.round.global`: `0`
- `TurnStart` + `pool.turn.personal`: `0.16`
- `TurnEnd` + `pool.turn.personal`: `0`

默认常用 10 事件（按池内权重抽取）：

- `event.nat`（8）
- `event.meltdown`（8）
- `event.rumor_backlash`（12）
- `event.gym_recovery`（12）
- `event.packet_loss`（10）
- `event.hotfix_patch`（14）
- `event.overtime_raid`（10）
- `event.supply_drop`（16）
- `event.keyboard_flash_sale`（12）
- `event.armor_outlet`（8）

### 5.7 `narration.ts`

- 基础事件标签映射模板（命中/暴击/闪避）。
- 支持同义句池与短期去重。
- 基础模板文风建议偏现实/梗文化口语，不写奇幻史诗腔。
- 默认模板应保持“通用语义”，避免绑定具体道具/状态名（如某件装备名）。
- 反伤、吸血等“效果型叙事”不建议写入基础模板；应由具体内容对象（如装备/Modifier）通过 `texts.trigger` 覆盖提供。
- 需要更精确的效果覆盖时，使用 `texts.triggerByTag`（如 `reflect`、`heal`、`dot`）。
- 具体内容（装备/天赋/状态）如需个性化文案，应在内容对象中定义（如 `modifier.texts.trigger`）并由 narration resolver 覆盖。
- 覆盖策略优先级：`triggerByTag[tag]` > `trigger` > 基础模板（`hit/crit/miss`）。
- resolver 覆盖实现建议：当模板依赖额外变量（如 `{modifierName}`）时，优先通过 resolver 返回 `{ templates, variables }`，避免在模板字符串上做硬编码替换。

示例：

```ts
resolveTemplates: (event) => {
  const byTag = modifier.texts?.triggerByTag?.reflect;
  if (Array.isArray(byTag) && byTag.length > 0) {
    return {
      templates: byTag,
      variables: {
        modifierId: modifier.id,
        modifierName: modifier.name,
      },
    };
  }
  return undefined;
}
```

---

## 6. 实现示例

### 6.1 新增一个 Modifier（示例：吸血）

创建文件：`src/content/modifiers/talent.lifeSteal30.ts`

```ts
import type { Modifier } from '../../engine/types';

const talentLifeSteal30: Modifier = {
  id: 'talent.lifesteal_30',
  source: 'TALENT',
  name: '嗜血本能',
  tags: ['talent'],
  triggers: [
    {
      trigger: {
        on: 'POST_ACTION',
        when: { role: 'SOURCE', eventType: 'ATTACK', notHasTags: ['miss', 'reflect', 'true_damage'] },
      },
      effects: [{ kind: 'LIFESTEAL', ratio: 0.3, tags: ['heal'] }],
    },
  ],
};

export default talentLifeSteal30;
```

然后在 `src/content/modifiers/index.ts` 注册到 `allModifiers`。

### 6.2 新增一个事件条目并加入事件池


说明：`triggerByTag.heal` 会优先用于治疗类系统日志（`logText('heal')`），若未定义则回退到 `trigger`，再回退到全局默认文本。
1) 新建条目文件 `src/content/events/entries/midnight.ts`

```ts
import type { EventPoolEntry } from '../../../engine/types';

const midnight: EventPoolEntry = {
  id: 'event.midnight',
  name: '网抑云时间',
  weight: 8,
  effects: [{ kind: 'APPLY_MODIFIER', target: 'SELF', modifier: { id: 'event.midnight.down', source: 'ENV', name: '临时低落', statBonus: { STR: -1 }, duration: 1 } }],
};

export default midnight;
```

2) 根据作用范围注册到对应事件池：

- 全体/随机单人事件 -> `src/content/events/pools/round.global.ts`
- 触发人个人事件 -> `src/content/events/pools/turn.personal.ts`

---

## 7. 新增内容指南（标准流程）

### 7.1 通用步骤

1. 在对应目录创建一个新文件（单文件单实现）。
2. 使用 `id` 命名规范（见 7.2）。
3. 在该类型目录 `index.ts` 注册到 `allXXX` 集合。
4. 若为 modifier，确保通过 `validateModifierSpec`。
5. 运行 `npm run build` 验证。

### 7.2 命名与 ID 规范

- 职业：`class.xxx`
- 装备：`equip.xxx`
- Buff/Debuff：`buff.xxx` / `debuff.xxx`
- 天赋：`talent.xxx`
- 事件条目：`event.xxx`
- 事件池：`pool.xxx`
- 消耗品：`consumable.xxx`

文件名建议语义化：

- `buff.shieldStart.ts`
- `event.midnight.ts`
- `round.global.ts`
- `turn.personal.ts`

### 7.3 注册规范

- 所有“可被引擎消费的集合”必须在本目录 `index.ts` 里统一导出。
- 禁止跨层级直接读取单文件实现（外部统一走 `src/content/index.ts`）。

---

## 8. 质量与约束

### 8.1 必须满足

- 内容配置对象必须可序列化（函数 hooks 除外）。
- 不得修改引擎核心来适配某个单一内容（优先 DSL）。
- 所有概率与随机必须由引擎 RNG 控制（内容不直接调 `Math.random()`）。

### 8.2 推荐实践

- 新功能先做最小内容条目，再扩量。
- 相似效果优先复用已有 `EffectSpec`。
- 复杂特例（hooks）要写清触发条件，避免无限链式反应。

---

## 9. 平衡性定义指南（新增内容必读）

目标：在“可快可慢”的前提下，避免极端秒杀。

### 9.1 属性与基础战斗参数建议

- 角色总属性（`STR+AGI+VIT+LUK`）建议落在 `60 ~ 95`（含职业模板后）
- `VIT` 建议区间：`12 ~ 28`（过低会放大快局）
- `STR` 建议区间：`10 ~ 26`
- 引擎核心参数（当前实现口径）
  - `hpBase = 102`
  - `hpPerVit = 11`
  - `attackScale = 1.7`
  - `critChance = 0.17`
  - `critMultiplier = 1.5`

> 原则：新增内容优先在内容层调节（Modifier/装备/职业），尽量不改引擎全局常量。

### 9.2 新增职业的数值建议

- 职业 `baseStats` 单项建议不超过 `16`
- 天赋若是稳定增伤，被动总增伤建议控制在 `10% ~ 25%`
- 天赋若是控制类（例如眩晕），建议满足：
  - 触发概率单次 `<= 20%`
  - 持续回合通常 `1` 回合

### 9.3 新增装备的数值建议

- 单件装备 `statBonus`：
  - `STR/AGI/VIT/LUK` 单项建议 `-4 ~ +6`
  - 避免同时提供高 STR + 高 AGI + 控制触发
- 防具减伤（`MITIGATE`）建议：
  - `multiplier` 建议 `0.7 ~ 0.9`
  - 最低伤害 `min` 建议 `>= 1`
- 反伤（`reflect`）建议：
  - 比例建议 `0.15 ~ 0.35`
  - 若反伤为真伤，请降低比例或增加触发条件

### 9.4 新增 Modifier 的建议区间

- `SHIELD`：
  - 每回合新增护盾建议不超过“平均单次命中伤害”的 `40%`
- `LIFESTEAL`：
  - 比例建议 `0.1 ~ 0.3`
  - 与高暴击内容叠加时优先下调到 `<= 0.2`
- `DISPEL`：
  - `max` 建议 `1`
- `duration`：
  - 常见 BUFF/DEBUFF 建议 `1 ~ 3` 回合
  - 强控制建议仅 `1` 回合

### 9.5 新增事件池内容建议

- 单事件权重建议放在 `5 ~ 40`
- 强负面或强正面事件建议低权重（`<= 16`）
- 环境事件不应连续叠加导致“不可行动超过 2 回合”

### 9.6 平衡验证流程（提交流程）

新增内容后建议至少执行：

1. `npm run test`（引擎核心 UT）
2. `npx tsx scripts/balance-sim.ts`（批量仿真）
3. 检查四个指标：平均回合、P50、快局占比、长局占比
4. 若偏离目标区间，优先回调内容数值，不要先改引擎全局参数

---

## 10. 快速检查清单（PR Review）

- [ ] 是否为单实现单文件
- [ ] 是否已在对应 `index.ts` 注册
- [ ] `id` 是否唯一且符合命名规范
- [ ] modifier 是否通过字段与 tag 校验
- [ ] 是否避免直接修改引擎核心
- [ ] `npm run build` 是否通过

- [ ] `npm run test` 是否通过
- [ ] 平衡仿真指标是否在目标区间（见第 9 节）

---

## 11. 对外导出约定

统一入口：`src/content/index.ts`

- 允许导出：`classes`、`consumables`、`equipments/cloneEquipment`、`eventPools`、`modifierCatalog/createModifierById`、`pickNarration`
- 业务层与引擎层都应依赖该聚合入口，避免路径耦合。
