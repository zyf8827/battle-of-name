# engine.ts 代码注释说明

本文档提供 `engine.ts` 文件中关键函数和概念的详细中文注释。

## 目录结构

### 1. 常量定义 (Lines 30-50)

```typescript
const limits: EngineLimits = {
  maxEventDepth: 8,                    // 最大事件递归深度
  maxEventsPerRound: 256,              // 每回合最大事件数
  maxDerivedEventsPerEvent: 12,         // 单事件最大衍生事件数
  maxTriggersPerModifierPerRound: 32,   // 单修饰器每回合最大触发次数
};
```

**用途**：防止无限递归和事件风暴

---

### 2. 核心工具函数

#### `createEnvUnit()` - 创建环境单位
**返回**：一个特殊的虚拟单位（id: 'ENV'），用于：
- 存放全局环境修饰器（天气、场地效果）
- 触发全局事件池
- 提供环境钩子执行上下文

#### `sortModifiers(modifiers)` - 修饰器确定性排序
**排序规则**（保证战斗可重复）：
1. `priority` (数值越小越优先，默认 0）
2. `appliedOrder` (应用时间戳，FIFO)
3. `id` (字典序，确保稳定排序）

#### `unitAlive(unit)` - 存活检查
**判定标准**：`unit.state.hp > 0`

#### `whenMatched(when, event, role)` - 触发器条件匹配
**检查项**：
- `when.role` 是否匹配（SOURCE/TARGET）
- `when.eventType` 是否匹配
- `when.hasTag` - 必须包含的标签
- `when.notHasTag` / `notHasTags` - 禁止的标签

#### `evaluateValue(unit, event, value)` - 计算数值表达式
**支持类型**：
- `FLAT`: 固定值
- `SCALE`: `unit.stats[stat] * ratio`
- `EVENT_VALUE`: 事件的原始 `value`

#### `cloneUnit(unit)` - 深拷贝单位
**拷贝内容**：
- 基础属性（stats）
- 动态状态（state + cd）
- 所有修饰器（modifiers）

---

### 3. 主函数 `runBattle(input, adapter) → BattleOutcome`

#### 初始化阶段
1. 创建环境单位 (`createEnvUnit`)
2. 初始化 RNG (`createRng(seed)`)
3. 调用 `adapter.bootstrap()` 获取初始数据：
   - 单位列表（由姓名哈希生成）
   - 事件池
   - 物品池（消耗品/装备）
   - 文本模板
   - 效果处理器
4. 计算所有单位的 `maxHp`（基于 VIT 属性）

#### 主循环阶段 (while loop, Line 1288)
```typescript
while (units.filter(unitAlive).length > 1 && round < 50) {
  round += 1;
  turn = 0;
  roundEventCount = 0;

  // === 1. RoundStart ===
  triggerRoundStart();
  // 触发全局事件池

  // === 2. Cooldown Tick ===
  decrementCooldowns();

  // === 3. 行动队列生成 ===
  const queue = units.filter(unitAlive).sort((left, right) => {
    // 按 AGI 排序，稳定排序
  });

  // === 4. Turn 循环 ===
  for (const acting of queue) {
    turn += 1;

    // TurnStart 钩子
    // 控制检查
    // 行动执行
    // TurnEnd 钩子
  }

  // === 5. RoundEnd ===
  triggerRoundEnd();
  tickDurations(); // 持续时间 -1，移除过期
}
```

**循环终止条件**：
- 只剩 1 个或更少的存活单位
- 回合数 ≥ 50

---

### 4. 事件管道系统

#### `processEvent(event)` - 核心事件处理器
**三阶段流程**：

```
1. 拦截阶段 (Interception)
   ├─ 环境修饰器 onOutgoing/onIncoming
   ├─ 发起者修饰器 onOutgoing
   ├─ 目标修饰器 onIncoming
   └─ 触发器 PIPELINE_OUTGOING/INCOMING
      ↓ (任何钩子返回 null = 取消事件）
2. 结算阶段 (Resolution)
   └─ resolveEvent() - 应用伤害/治疗/状态
      ↓
3. 反应阶段 (Reaction)
   └─ onPostAction 钩子生成衍生事件
      └─ 递归调用 processEvent(derivedEvent)
```

**安全机制**：
- 深度检查：`event.depth > limits.maxEventDepth`
- 数量检查：`roundEventCount > limits.maxEventsPerRound`
- 去重检查：`dedup.has(eventKey)`

#### `resolveEvent(event)` - 事件结算
**处理的事件类型**：
- `ATTACK`: 扣除护盾 → 扣除 HP → 统计伤害 → 记录日志 → 如果死亡触发 DEATH
- `HEAL`: 增加 HP（上限 maxHp）→ 记录日志
- `APPLY_BUFF`: 应用修饰器 → 记录日志
- `REMOVE_BUFF`: 移除修饰器 → 记录日志
- `DEATH`: 记录死亡日志

#### `collectDerivedFromHooks(event)` - 衍生事件收集
**流程**：
1. 遍历 source/target/env 的所有修饰器
2. 执行 `onPostAction` 钩子
3. 收集钩子返回的事件列表
4. 限制数量：`slice(0, limits.maxDerivedEventsPerEvent)`

---

### 5. 修饰器系统

#### `applyModifierToArray(list, modifier)` - 应用修饰器到列表
**叠加策略处理**：
- `IGNORE`: 已存在相同 stackKey 则忽略
- `REPLACE`: 替换旧的修饰器
- `REFRESH_DURATION`: 刷新持续时间（默认）
- `STACK`: 增加层数（受 maxStacks 限制）

#### `runModifierTriggers(owner, triggerOn, event, phase)` - 执行修饰器触发器
**触发逻辑**：
1. 遍历 owner 的所有修饰器（已排序）
2. 检查触发次数限制（`maxTriggersPerModifierPerRound`）
3. 匹配 `triggerOn` 的触发器：
   - `ROUND_START` / `TURN_START` / `PIPELINE_OUTGOING` / `PIPELINE_INCOMING` / `POST_ACTION`
4. 检查 `when` 条件（`whenMatched`）
5. 执行效果列表（`fireEffects`）

#### `fireEffects(owner, trigger, effects, event, phase)` - 执行效果列表
**流程**：
1. 检查 `when` 条件
2. 遍历所有 `EffectSpec`
3. 获取对应的效果处理器（`effectHandlers[effect.kind]`）
4. 执行处理器，传入 `EffectHandlerContext`
5. 如果处理器返回事件，更新 `currentEvent`
6. 返回最终事件（可能为 null = 被取消）

---

### 6. 回合/行动钩子

#### `triggerRoundStart()` - 触发回合开始
**执行顺序**：
1. 环境修饰器 `onRoundStart` 钩子
2. 环境触发器 `ROUND_START`
3. 遍历所有存活单位：
   - 执行 `onRoundStart` 钩子
   - 执行 `ROUND_START` 触发器

#### `triggerRoundEnd()` - 触发回合结束
**执行顺序**：同 `triggerRoundStart`，但使用 `onRoundEnd` 钩子

#### `tickDurations()` - 持续时间结算
**逻辑**：
1. 遍历所有单位和环境的修饰器列表
2. 如果 `modifier.duration > 0`，则 `duration -= 1`
3. 如果 `duration <= 0`，从列表中移除

#### `decrementCooldowns()` - 冷却时间减少
**逻辑**：
1. 遍历所有单位
2. 对 `state.cd` 中的每个技能 ID：
   - `cd[skillId] = max(0, cd[skillId] - 1)`
   - 限制最大值 999

---

### 7. 物品和装备系统

#### `grantConsumableWithPolicy()` / `loseConsumable...()`
**策略**：由 `contentAdapter` 提供，通常：
- 获取物品池
- 随机选择（加权）
- 添加/移除到 `unit.state.consumables`
- 记录日志

#### `grantEquipmentWithPolicy()` / `loseEquipment...()`
**策略**：
- 获取装备池（按 slot 过滤）
- 随机选择
- 应用为修饰器（`source = 'EQUIP'`）
- 移除时需匹配 `source = 'EQUIP'`

---

### 8. 运行时 API (EngineRuntime)

#### `runtime.rng` - 随机数生成
- `next()`: [0, 1) 随机数
- `range(min, max)`: [min, max] 随机整数
- `bool(chance, luck?)`: 概率判定（支持幸运加成）
- `weightedPick(options, weights)`: 加权随机选择

#### `runtime.calc` - 数学计算
- `clamp(value, min, max)`: 数值限制
- `toInt(value)`, `nonNegativeInt(value)`: 整数化
- `safeStat(value)`, `safeHp(value, maxHp)`, `safeShield(value)`: 安全化
- `chance(base)`: 概率值计算
- `critRate(base, luk)`, `evadeRate(base, luk)`: 暴击/闪避率
- `scale(value, ratio)`: 缩放计算
- `splitDamageByShield(incoming, shield)`: 护盾伤害分配
- `hpAfterDamage(hp, damage)`, `hpAfterHeal(...)`: HP 计算

#### `runtime.rule` - 规则引擎
- `evaluateValueExpr(unit, event, expr)`: 计算数值表达式
- `whenMatched(when, event, role)`: 条件匹配

#### `runtime.event` - 事件操作
- `make(partial)`: 创建事件对象
- `process(event)`: 处理事件
- `triggerPool(poolId, ownerId, ...)`: 触发事件池
- `emitDirectDamage()`, `emitDirectHeal()`: 发出直接事件（绕过管道）

#### `runtime.state` - 状态操作
- `resolveTargets()`, `resolveTargetFromEvent()`: 目标解析
- `applyModifierEffect()`: 应用修饰器效果
- `removeModifiersByMatcher()`: 批量移除修饰器
- `grant/lose Consumable/Equipment`: 物品管理
- `grant/lose RandomItem`: 随机物品

#### `runtime.log.system` - 日志记录
- `system({ key, variables, tags, actor, target })`: 记录系统日志

---

### 9. 关键设计模式

#### 确定性保证
1. **RNG**: 使用种子随机数生成器
2. **排序**: 所有遍历都使用确定性排序（AGI, priority, appliedOrder, id）
3. **轨迹记录**: 所有 RNG 调用和事件都记录在 `replay` 中

#### 事件驱动
- 所有战斗行为都是事件（攻击、治疗、Buff等）
- 事件可被修饰器拦截、修改、取消
- 事件可触发新事件（递归 DFS）

#### 修饰器优先
- 装备、Buff、天赋、环境效果都是修饰器
- 修饰器通过钩子或 DSL 触发效果
- 统一的叠加策略（STACK/REFRESH/REPLACE/IGNORE）

#### 深度优先
- 事件递归有深度限制
- 每回合事件数有限制
- 单修饰器触发次数有限制

---

## 扩展点

### 添加新的事件类型
1. 在 `types.ts` 中添加 `CombatEvent['type']`
2. 在 `resolveEvent()` 中添加处理逻辑
3. 在 `contentAdapter` 中添加文本模板

### 添加新的效果类型
1. 定义新的 `EffectSpec.kind`
2. 实现效果处理器（`(ctx: EffectHandlerContext) => CombatEvent | void`）
3. 在 `bootstrap.effectHandlers` 中注册

### 添加新的触发器钩子
1. 在 `types.ts` 的 `ModifierHooks` 中添加新钩子
2. 在 `runModifierTriggers()` 或主循环中添加调用点
3. 在 `EffectHandlerContext` 中添加必要的上下文数据

---

## 性能优化

### 已实施
- 事件去重（防止重复处理）
- 触发次数限制（防止无限循环）
- 深度限制（防止栈溢出）
- 快照缓存（仅回合结束时保存）

### 可优化
- 修饰器缓存（避免重复排序）
- 事件池预过滤（避免无效查找）
- 日志延迟渲染（减少字符串拼接）
