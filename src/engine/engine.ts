/**
 * 战斗引擎 - 核心实现
 *
 * 本模块实现完整的回合制自动战斗引擎，遵循以下设计原则：
 *
 * 1. **确定性 (Determinism)**: 相同的输入（姓名 + 种子）→ 相同的战斗结果
 *    - 使用 seedrandom 实现基于种子的 RNG
 *    - 所有随机调用都记录在回放轨迹中
 *    - 修饰器触发顺序固定（priority → appliedOrder → id）
 *
 * 2. **事件驱动 (Event-Driven)**: 所有战斗行为通过事件表达
 *    - 三阶段管道：拦截 (Intercept) → 结算 (Resolve) → 反应 (React)
 *    - 支持递归衍生事件（如反弹伤害、吸血）
 *    - 事件可被修饰器修改或取消
 *
 * 3. **修饰器优先 (Modifier-First)**: 所有游戏效果统一为修饰器
 *    - 装备、天赋、Buff、环境效果都实现为 Modifier
 *    - DSL 支持 80% 的效果（无需编写代码）
 *    - 自定义钩子覆盖剩余 20% 的复杂场景
 *
 * === 主流程 ===
 *
 * runBattle(input, contentAdapter) → BattleOutcome
 *
 * 战斗主循环（见文件末尾 while 循环）：
 * 1. RoundStart: 回合开始钩子 + 全局事件池触发
 * 2. Cooldown Tick: 所有冷却时间 -1
 * 3. 行动队列: 按 AGI 排序（稳定排序）
 * 4. Turn 循环（对每个存活单位）：
 *    - TurnStart 钩子
 *    - 控制检查（眩晕等）
 *    - 行动执行（攻击/技能）
 *    - TurnEnd 钩子
 * 5. RoundEnd: 回合结束钩子 + 全局事件池触发
 * 6. Duration Tick:
 *    - 单位修饰器：在各自 TurnEnd 时结算（即使该单位被控跳过行动）
 *    - 环境修饰器：在 RoundEnd 统一结算
 *
 * === 关键数据结构 ===
 *
 * - Unit: 战斗单位（玩家/敌人/环境）
 * - Modifier: 修饰器（装备/Buff/天赋/环境）
 * - CombatEvent: 战斗事件（攻击/治疗/应用修饰器等）
 * - EngineRuntime: 提供给修饰器的运行时 API
 */

import type { BattleContentAdapter, BattleSystemLogKey, EffectHandlerContext } from './contentAdapter';
import { deepCloneKeepFns } from './clone';
import { ENGINE_VERSION } from './replay';
import { createRng } from './rng';
import {
  grantConsumableWithPolicy,
  grantEquipmentWithPolicy,
  loseConsumableByIdWithPolicy,
  loseEquipmentByIdWithPolicy,
  loseRandomConsumableWithPolicy,
  loseRandomEquipmentWithPolicy,
} from './runtimeServices';
import { EventScheduler } from './scheduler';
import type {
  BaseStats,
  BattleConfig,
  BattleOutcome,
  CombatEvent,
  EffectSpec,
  EngineRuntime,
  EventWhen,
  InteractionContext,
  Modifier,
  Snapshot,
  TriggerSpec,
  Unit,
  ValueExpr,
} from './types';
import { DEFAULT_BATTLE_CONFIG } from './types';

const NUMERIC_LIMITS = {
  minChance: 0,
  maxChance: 1,
  maxStat: 9999,
  maxHp: 1_000_000,
  maxShield: 1_000_000,
  maxEventValue: 1_000_000,
};

function createEnvUnit(): Unit {
  return {
    id: 'ENV',
    name: '环境',
    stats: { STR: 0, AGI: 0, VIT: 0, LUK: 0 },
    state: { hp: 1, maxHp: 1, shield: 0, cd: {} },
    modifiers: [],
  };
}

function sortModifiers(modifiers: Modifier[]): Modifier[] {
  return [...modifiers].sort((left, right) => {
    const priorityDiff = (right.priority ?? 0) - (left.priority ?? 0);
    if (priorityDiff !== 0) return priorityDiff;
    const appliedDiff = (left.appliedOrder ?? 0) - (right.appliedOrder ?? 0);
    if (appliedDiff !== 0) return appliedDiff;
    return left.id.localeCompare(right.id);
  });
}

function unitAlive(unit: Unit): boolean {
  return unit.state.hp > 0;
}

function whenMatched(when: EventWhen | undefined, event: CombatEvent, role: 'SOURCE' | 'TARGET'): boolean {
  if (!when) return true;
  if (when.role && when.role !== role) return false;
  if (when.eventType && when.eventType !== event.type) return false;
  if (when.hasTag && !event.payload.tags.includes(when.hasTag)) return false;
  if (when.notHasTag && event.payload.tags.includes(when.notHasTag)) return false;
  if (when.notHasTags?.some((tag) => event.payload.tags.includes(tag))) return false;
  return true;
}

function evaluateValue(unit: Unit, event: CombatEvent | undefined, value: ValueExpr): number {
  if (value.type === 'FLAT') return value.value;
  if (value.type === 'SCALE') return (unit.stats[value.stat] ?? 0) * value.ratio;
  return event?.payload.value ?? 0;
}

function cloneUnit(unit: Unit): Unit {
  return {
    ...unit,
    stats: { ...unit.stats },
    state: { ...unit.state, cd: { ...unit.state.cd } },
    modifiers: unit.modifiers.map((modifier) => deepCloneKeepFns(modifier)),
  };
}

export function runBattle(
  input: { name1: string; name2: string; seed: string },
  contentAdapter: BattleContentAdapter,
  config?: BattleConfig,
): BattleOutcome {
  const { name1, name2, seed } = input;

  // 合并默认配置和用户配置
  const finalConfig = {
    balance: { ...DEFAULT_BATTLE_CONFIG.balance, ...config?.balance },
    limits: { ...DEFAULT_BATTLE_CONFIG.limits, ...config?.limits },
    maxRounds: config?.maxRounds ?? DEFAULT_BATTLE_CONFIG.maxRounds,
  };
  const BALANCE = finalConfig.balance;
  const limits = finalConfig.limits;
  // const debugEnabled = (() => {
  //   const raw = (globalThis as Record<string, unknown>).__BATTLE_DEBUG__;
  //   return raw === true || raw === 'true' || raw === 1;
  // })();
  const debugLog = (scope: string, payload: Record<string, unknown>) => {
    // if (!debugEnabled) return;
    console.info('[battle-debug]', scope, payload);
  };
  const envUnit = createEnvUnit();
  const rng = createRng(seed);
  const bootstrap = contentAdapter.bootstrap({ name1, name2, seed });
  const units: Unit[] = bootstrap.units.map((unit) => cloneUnit(deepCloneKeepFns(unit)));
  const eventPools = bootstrap.eventPools;
  const consumablePoolIds = bootstrap.consumablePoolIds ?? [];
  const equipmentPoolIds = bootstrap.equipmentPoolIds ?? [];
  const scheduler = new EventScheduler(eventPools, bootstrap.scheduleRules);
  const narrate = bootstrap.narrate;
  const logText = bootstrap.logText;
  const createModifierById = bootstrap.createModifierById;
  const getConsumableById = bootstrap.getConsumableById;
  const getEquipmentById = bootstrap.getEquipmentById ?? (() => undefined);
  const effectHandlers = bootstrap.effectHandlers ?? {};
  const executeTurnAction = bootstrap.executeTurnAction;
  const executeTurnConsumable = bootstrap.executeTurnConsumable;
  const resolveControlSource = bootstrap.resolveControlSource;

  if (units.length < 2) {
    throw new Error('Battle requires at least 2 units from content adapter');
  }
  if (!executeTurnAction) {
    throw new Error('Battle content adapter must provide executeTurnAction');
  }
  if (!executeTurnConsumable) {
    throw new Error('Battle content adapter must provide executeTurnConsumable');
  }
  if (!resolveControlSource) {
    throw new Error('Battle content adapter must provide resolveControlSource');
  }
  const runTurnAction = executeTurnAction;
  const runTurnConsumableExecutor = executeTurnConsumable;
  const runControlResolver = resolveControlSource;

  for (const unit of units) {
    if (unit.state.maxHp <= 0) {
      unit.state.maxHp = BALANCE.hpBase + unit.stats.VIT * BALANCE.hpPerVit;
    }
    if (unit.state.hp <= 0) {
      unit.state.hp = unit.state.maxHp;
    }
  }

  const envModifiers: Modifier[] = (bootstrap.envModifiers ?? []).map((modifier) => deepCloneKeepFns(modifier));
  const logs: BattleOutcome['logs'] = [];
  const totalDamageByUnit: Record<string, number> = Object.fromEntries(units.map((unit) => [unit.id, 0]));
  const snapshots: Snapshot[] = [];
  const recentNarrationKeys: string[] = [];
  const triggerCount = new Map<string, number>();
  const dedup = new Set<string>();

  let round = 0;
  let turn = 0;
  let eventSeq = 0;
  let roundEventCount = 0;
  let appliedOrderCounter = 0;

  const getUnit = (id: string): Unit => {
    if (id === 'ENV') return envUnit;
    const found = units.find((item) => item.id === id);
    if (!found) {
      throw new Error(`Unit ${id} not found`);
    }
    return found;
  };

  const getEnemy = (id: string): Unit => units.find((item) => item.id !== id) ?? units[0];

  // 核心数值计算库：处理战斗中的所有数学公式，确保数值在安全范围内
  const runtimeMath: EngineRuntime['calc'] = {
    clamp: (value, min, max) => {
      if (!Number.isFinite(value)) return min;
      if (max < min) return min;
      return Math.min(max, Math.max(min, value));
    },
    toInt: (value, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) => {
      if (!Number.isFinite(value)) return min;
      return Math.min(max, Math.max(min, Math.floor(value)));
    },
    nonNegativeInt: (value, max = NUMERIC_LIMITS.maxEventValue) => {
      if (!Number.isFinite(value)) return 0;
      return Math.min(max, Math.max(0, Math.floor(value)));
    },
    safeStat: (value) => {
      if (!Number.isFinite(value)) return 1;
      return Math.min(NUMERIC_LIMITS.maxStat, Math.max(1, Math.floor(value)));
    },
    safeHp: (value, maxHp) => {
      const safeMaxHp = Math.min(NUMERIC_LIMITS.maxHp, Math.max(1, Math.floor(maxHp)));
      if (!Number.isFinite(value)) return safeMaxHp;
      return Math.min(safeMaxHp, Math.max(0, Math.floor(value)));
    },
    safeShield: (value) => {
      if (!Number.isFinite(value)) return 0;
      return Math.min(NUMERIC_LIMITS.maxShield, Math.max(0, Math.floor(value)));
    },
    chance: (base, options) => {
      const min = options?.min ?? NUMERIC_LIMITS.minChance;
      const max = options?.max ?? NUMERIC_LIMITS.maxChance;
      if (!Number.isFinite(base)) return min;
      return Math.min(max, Math.max(min, base));
    },
    // 暴击率计算：基础暴击 + 幸运值(LUK)修正
    // 幸运值对暴击率有微小但线性的影响
    critRate: (base, luk) => {
      const safeBase = Number.isFinite(base) ? base : 0;
      const safeLuk = Number.isFinite(luk) ? luk : 0;
      const lukBonus = Math.max(-0.12, Math.min(0.18, safeLuk * 0.0015));
      return Math.min(0.95, Math.max(0.01, safeBase + lukBonus));
    },
    // 闪避率计算
    evadeRate: (base, luk) => {
      const safeBase = Number.isFinite(base) ? base : 0;
      const safeLuk = Number.isFinite(luk) ? luk : 0;
      const lukBonus = Math.max(-0.1, Math.min(0.2, safeLuk * 0.001));
      return Math.min(0.85, Math.max(0, safeBase + lukBonus));
    },
    scale: (value, ratio, min = 0, max = NUMERIC_LIMITS.maxEventValue) => {
      const safeValue = Number.isFinite(value) ? value : 0;
      const safeRatio = Number.isFinite(ratio) ? ratio : 0;
      return Math.min(max, Math.max(min, Math.floor(safeValue * safeRatio)));
    },
    // 护盾结算逻辑：优先扣除护盾，剩余伤害溢出到 HP
    splitDamageByShield: (incoming, shield) => {
      const safeIncoming = Math.max(0, Math.floor(Number.isFinite(incoming) ? incoming : 0));
      const safeShield = Math.max(0, Math.floor(Number.isFinite(shield) ? shield : 0));
      const shieldBlocked = Math.min(safeShield, safeIncoming);
      const hpDamage = safeIncoming - shieldBlocked;
      return {
        incoming: safeIncoming,
        shieldBlocked,
        hpDamage,
        shieldAfter: safeShield - shieldBlocked,
      };
    },
    hpAfterDamage: (hp, damage) => {
      const safeHp = Math.max(0, Math.floor(Number.isFinite(hp) ? hp : 0));
      const safeDamage = Math.max(0, Math.floor(Number.isFinite(damage) ? damage : 0));
      return Math.max(0, safeHp - safeDamage);
    },
    hpAfterHeal: (hp, maxHp, amount) => {
      const safeHp = Math.max(0, Math.floor(Number.isFinite(hp) ? hp : 0));
      const safeMaxHp = Math.min(NUMERIC_LIMITS.maxHp, Math.max(1, Math.floor(Number.isFinite(maxHp) ? maxHp : 1)));
      const safeAmount = Math.max(0, Math.floor(Number.isFinite(amount) ? amount : 0));
      return Math.min(safeMaxHp, safeHp + safeAmount);
    },
  };

  const makeEvent: EngineRuntime['event']['make'] = (partial) => ({
    id: `evt-${round}-${turn}-${eventSeq + 1}`,
    type: partial.type,
    sourceId: partial.sourceId,
    targetId: partial.targetId,
    meta: {
      round,
      turn,
      seq: partial.meta?.seq ?? ++eventSeq,
    },
    payload: partial.payload,
    depth: partial.depth,
    parentId: partial.parentId,
  });

  const sortedUnitModifiers = (unit: Unit): Modifier[] => sortModifiers(unit.modifiers);
  const sortedEnvModifiers = (): Modifier[] => sortModifiers(envModifiers);

  const createSnapshot = (): Snapshot => ({
    round,
    units: units.map(cloneUnit),
    envModifiers: sortedEnvModifiers().map((modifier) => deepCloneKeepFns(modifier)),
  });

  const pushLog = ({ seq, ...entry }: Omit<BattleOutcome['logs'][number], 'seq'> & { seq?: number }) => {
    logs.push({ ...entry, seq: seq ?? ++eventSeq });
    snapshots.push(createSnapshot());
  };

  const resolveSystemLog = (
    key: BattleSystemLogKey,
    variables: Record<string, string | number | undefined>,
  ): string =>
    logText(
      key,
      {
        round,
        turn,
        ...variables,
      },
      rng.next(`log.system.${key}`),
    );

  // Modifier 堆叠逻辑处理
  // 处理 Buffer/Debuff 的叠加规则：
  // - IGNORE: 已存在则忽略新加的
  // - REPLACE: 替换旧的
  // - REFRESH_DURATION: 刷新持续时间 (默认)
  // - STACK: 增加层数
  const applyModifierToArray = (list: Modifier[], modifier: Modifier): void => {
    const cloned = deepCloneKeepFns(modifier);
    const key = cloned.stacking?.stackKey;
    
    // 如果没有 stackKey，视为独立 Modifier，直接添加
    if (!key) {
      cloned.appliedOrder = ++appliedOrderCounter;
      list.push(cloned);
      return;
    }

    // 检查是否已存在同名 Modifier
    const exists = list.find((item) => item.stacking?.stackKey === key);
    if (!exists) {
      cloned.appliedOrder = ++appliedOrderCounter;
      list.push(cloned);
      return;
    }

    // 处理堆叠策略
    const policy = cloned.stacking?.policy ?? 'REFRESH_DURATION';
    switch (policy) {
      case 'IGNORE':
        return;
      case 'REPLACE': {
        const index = list.indexOf(exists);
        cloned.appliedOrder = ++appliedOrderCounter;
        list[index] = cloned;
        return;
      }
      case 'REFRESH_DURATION':
        exists.duration = cloned.duration;
        exists.stacks = 1;  // 显式重置层数为1
        return;
      case 'STACK':
        exists.stacks = Math.min((exists.stacks ?? 1) + 1, cloned.stacking?.maxStacks ?? Number.MAX_SAFE_INTEGER);
        exists.duration = Math.max(exists.duration ?? -1, cloned.duration ?? -1);
        return;
      default:
        return;
    }
  };

  const applyModifier = (targetId: string, modifier: Modifier): void => {
    if (modifier.source === 'ENV' || targetId === 'ENV') {
      applyModifierToArray(envModifiers, modifier);
      return;
    }
    applyModifierToArray(getUnit(targetId).modifiers, modifier);
  };

  function pickRandomAliveUnit(): Unit | undefined {
    const alive = units.filter(unitAlive);
    if (alive.length === 0) return undefined;
    if (alive.length === 1) return alive[0];
    return rng.weightedPick(alive, () => 1, 'event.randomTarget');
  }

  function pickRandomFrom<T>(values: T[], label: string): T | undefined {
    if (values.length === 0) return undefined;
    if (values.length === 1) return values[0];
    return rng.weightedPick(values, () => 1, label);
  }

  function pickRandomConsumableId(): string | undefined {
    const candidates = consumablePoolIds.filter((id) => !!getConsumableById(id));
    return pickRandomFrom(candidates, 'runtime.state.grantRandomConsumable');
  }

  function pickRandomEquipment(slot?: 'WEAPON' | 'ARMOR' | 'ACCESSORY'): Modifier | undefined {
    const candidates = equipmentPoolIds
      .map((id) => getEquipmentById(id))
      .filter((item): item is Modifier => !!item)
      .filter((modifier) => {
        if (!slot) return true;
        const withSlot = modifier as Modifier & { slot?: string };
        return withSlot.slot === slot;
      })
      .map((modifier) => deepCloneKeepFns(modifier));
    return pickRandomFrom(candidates, 'runtime.state.grantRandomEquipment');
  }

  function pickRandomItemKind(target: Unit, mode: 'gain' | 'lose'): 'consumable' | 'equipment' | undefined {
    if (mode === 'gain') {
      const hasConsumablePool = consumablePoolIds.some((id) => !!getConsumableById(id));
      const hasEquipmentPool = equipmentPoolIds.some((id) => !!getEquipmentById(id));
      const kinds: Array<'consumable' | 'equipment'> = [
        ...(hasConsumablePool ? (['consumable'] as const) : []),
        ...(hasEquipmentPool ? (['equipment'] as const) : []),
      ];
      return pickRandomFrom(kinds, 'runtime.state.randomItemKind.gain');
    }

    const hasAnyEquipOwned = target.modifiers.some((modifier) => modifier.source === 'EQUIP');
    const hasAnyConsumableOwned = (target.state.consumables ?? []).length > 0;
    const kinds: Array<'consumable' | 'equipment'> = [
      ...(hasAnyConsumableOwned ? (['consumable'] as const) : []),
      ...(hasAnyEquipOwned ? (['equipment'] as const) : []),
    ];
    return pickRandomFrom(kinds, 'runtime.state.randomItemKind.lose');
  }

  function resolveEffectTargets(owner: Unit, selector: 'SELF' | 'SOURCE' | 'TARGET' | 'ALL'): Unit[] {
    if (selector === 'ALL') {
      return units.filter(unitAlive);
    }
    if (selector === 'SELF' || selector === 'SOURCE') {
      if (owner.id === 'ENV') {
        const random = pickRandomAliveUnit();
        return random ? [random] : [];
      }
      return unitAlive(owner) ? [owner] : [];
    }
    if (owner.id === 'ENV') {
      const random = pickRandomAliveUnit();
      return random ? [random] : [];
    }
    const enemy = getEnemy(owner.id);
    return unitAlive(enemy) ? [enemy] : [];
  }

  function resolveTargetFromEvent(selector: 'SELF' | 'SOURCE' | 'TARGET', owner: Unit, event: CombatEvent): Unit {
    if (selector === 'SELF') {
      return owner;
    }
    if (selector === 'SOURCE') {
      return getUnit(event.sourceId);
    }
    return getUnit(event.targetId);
  }

  let runtimeServiceDeps: {
    pickRandomFrom: <T>(values: T[], label: string) => T | undefined;
    cloneModifier: <T>(value: T) => T;
    applyModifier: (targetId: string, modifier: Modifier) => void;
    removeModifier: (targetId: string, modifierId?: string, stackKey?: string, max?: number) => number;
    log: (args: {
      key: 'pickupConsumable' | 'dropConsumable' | 'pickupEquipment' | 'replaceEquipment' | 'dropEquipment';
      variables: Record<string, string | number | undefined>;
      tags: ('env' | 'equip')[];
      actor: Unit;
      target: Unit;
    }) => void;
  };

  const removeModifierFromArray = (list: Modifier[], matcher: (modifier: Modifier) => boolean, max = Number.MAX_SAFE_INTEGER): number => {
    let removed = 0;
    for (let index = list.length - 1; index >= 0; index -= 1) {
      if (removed >= max) break;
      if (matcher(list[index])) {
        list.splice(index, 1);
        removed += 1;
      }
    }
    return removed;
  };

  const removeModifier = (targetId: string, modifierId?: string, stackKey?: string, max?: number): number => {
    const list = targetId === 'ENV' ? envModifiers : getUnit(targetId).modifiers;
    return removeModifierFromArray(
      list,
      (modifier) => {
        if (modifierId && modifier.id === modifierId) return true;
        if (stackKey && modifier.stacking?.stackKey === stackKey) return true;
        return false;
      },
      max,
    );
  };

  runtimeServiceDeps = {
    pickRandomFrom,
    cloneModifier: deepCloneKeepFns,
    applyModifier,
    removeModifier,
    log: ({ key, variables, tags, actor, target }) => {
      pushLog({
        round,
        turn,
        text: resolveSystemLog(key, variables),
        tags,
        actorId: actor.id,
        actorName: actor.name,
        targetId: target.id,
        targetName: target.name,
      });
    },
  };

  const runtime: EngineRuntime = {
    rng,
    calc: runtimeMath,
    rule: {
      evaluateValueExpr: evaluateValue,
      whenMatched,
    },
    event: {
      make: makeEvent,
      process: processEvent,
      triggerPool,
      emitDirectDamage: (owner, target, value, tags, depth, parentId) => {
        const amount = runtimeMath.nonNegativeInt(value);
        processEvent(
          makeEvent({
            type: 'ATTACK',
            sourceId: owner.id,
            targetId: target.id,
            depth: depth ?? 1,
            parentId,
            payload: {
              value: amount,
              tags: tags ?? ['true_damage', 'env'],
            },
          }),
        );
        pushLog({
          round,
          turn,
          text: resolveSystemLog('eventDamage', {
            sourceName: owner.name,
            sourceId: owner.id,
            targetName: target.name,
            targetId: target.id,
            amount,
          }),
          tags: tags ?? ['env'],
          actorId: owner.id,
          actorName: owner.name,
          targetId: target.id,
          targetName: target.name,
        });
      },
      emitDirectHeal: (owner, target, value, tags, depth, parentId) => {
        const amount = runtimeMath.nonNegativeInt(value);
        processEvent(
          makeEvent({
            type: 'HEAL',
            sourceId: owner.id,
            targetId: target.id,
            depth: depth ?? 1,
            parentId,
            payload: {
              value: amount,
              tags: tags ?? ['heal', 'env'],
            },
          }),
        );
      },
    },
    state: {
      resolveTargets: (owner, selector) => resolveEffectTargets(owner, selector),
      resolveTargetFromEvent: (owner, selector, event) => resolveTargetFromEvent(selector, owner, event),
      applyModifierEffect,
      removeModifiersByMatcher: (target, matcher, max) => removeModifierFromArray(target.modifiers, matcher, max),
      grantConsumable: (target, consumableId) => grantConsumableWithPolicy(runtimeServiceDeps, target, consumableId),
      grantRandomConsumable: (target) => {
        const picked = pickRandomConsumableId();
        if (!picked) return;
        grantConsumableWithPolicy(runtimeServiceDeps, target, picked);
      },
      loseRandomConsumable: (target, count) => {
        const times = runtimeMath.toInt(count ?? 1, 1, 12);
        for (let index = 0; index < times; index += 1) {
          loseRandomConsumableWithPolicy(runtimeServiceDeps, target);
        }
      },
      loseConsumable: (target, consumableId) => loseConsumableByIdWithPolicy(runtimeServiceDeps, target, consumableId),
      grantEquipment: (target, equipment) => grantEquipmentWithPolicy(runtimeServiceDeps, target, equipment),
      grantRandomEquipment: (target, slot) => {
        const picked = pickRandomEquipment(slot);
        if (!picked) return;
        grantEquipmentWithPolicy(runtimeServiceDeps, target, picked);
      },
      loseRandomEquipment: (target, slot) => loseRandomEquipmentWithPolicy(runtimeServiceDeps, target, slot),
      loseEquipment: (target, equipmentId) => loseEquipmentByIdWithPolicy(runtimeServiceDeps, target, equipmentId),
      grantRandomItem: (target) => {
        const kind = pickRandomItemKind(target, 'gain');
        if (kind === 'consumable') {
          const picked = pickRandomConsumableId();
          if (picked) grantConsumableWithPolicy(runtimeServiceDeps, target, picked);
          return;
        }
        if (kind === 'equipment') {
          const picked = pickRandomEquipment();
          if (picked) grantEquipmentWithPolicy(runtimeServiceDeps, target, picked);
        }
      },
      loseRandomItem: (target) => {
        const kind = pickRandomItemKind(target, 'lose');
        if (kind === 'consumable') {
          loseRandomConsumableWithPolicy(runtimeServiceDeps, target);
          return;
        }
        if (kind === 'equipment') {
          loseRandomEquipmentWithPolicy(runtimeServiceDeps, target);
        }
      },
    },
    log: {
      system: ({ key, variables, tags, actor, target }) => {
        pushLog({
          round,
          turn,
          text: resolveSystemLog(key as BattleSystemLogKey, variables),
          tags,
          actorId: actor?.id,
          actorName: actor?.name,
          targetId: target?.id,
          targetName: target?.name,
        });
      },
    },
  };

  function buildModifierFromEffect(effect: EffectSpec): Modifier {
    if (effect.kind !== 'APPLY_MODIFIER') {
      throw new Error('buildModifierFromEffect only supports APPLY_MODIFIER');
    }

    const modifier = 'modifier' in effect ? effect.modifier : undefined;
    const modifierId = 'modifierId' in effect ? effect.modifierId : undefined;
    const duration = 'duration' in effect ? effect.duration : undefined;
    const textOverrides = 'textOverrides' in effect ? effect.textOverrides : undefined;

    let created: Modifier;
    if (modifier && typeof modifier === 'object') {
      created = deepCloneKeepFns(modifier as Modifier);
    } else if (typeof modifierId === 'string') {
      created = createModifierById(modifierId, typeof duration === 'number' ? duration : undefined);
    } else {
      throw new Error('APPLY_MODIFIER requires modifier or modifierId');
    }
    if (typeof duration === 'number') {
      created.duration = duration;
    }
    if (!textOverrides || typeof textOverrides !== 'object') {
      return created;
    }
    created.texts = {
      ...created.texts,
      ...(textOverrides as Modifier['texts']),
      triggerByTag: {
        ...(created.texts?.triggerByTag ?? {}),
        ...(((textOverrides as Modifier['texts'])?.triggerByTag ?? {}) as NonNullable<Modifier['texts']>['triggerByTag']),
      },
    };
    return created;
  }

  function applyModifierEffect(
    source: Unit,
    target: Unit,
    effect: EffectSpec,
  ): void {
    const modifier = buildModifierFromEffect(effect);
    applyModifier(target.id, modifier);
    pushLog({
      round,
      turn,
      text: resolveSystemLog('applyBuff', {
        sourceName: source.name,
        sourceId: source.id,
        targetName: target.name,
        targetId: target.id,
        targetHp: target.state.hp,
        targetMaxHp: target.state.maxHp,
        targetShield: target.state.shield,
        modifierName: modifier.name,
        modifierId: modifier.id,
        modifierSource: modifier.source,
        modifierDuration: modifier.duration,
      }),
      tags: modifier.tags ?? ['buff'],
      actorId: target.id,
      actorName: target.name,
      targetId: target.id,
      targetName: target.name,
    });
  }

  function createEffectContext(params: {
    owner: Unit;
    effect: EffectSpec;
    event: CombatEvent | null;
    trigger: TriggerSpec;
    phase: 'INTERCEPT' | 'REACTION';
    role: 'SOURCE' | 'TARGET';
    depth: number;
    parentId?: string;
  }): EffectHandlerContext {
    return {
      owner: params.owner,
      effect: params.effect,
      event: params.event,
      trigger: params.trigger,
      phase: params.phase,
      role: params.role,
      runtime,
      depth: params.depth,
      parentId: params.parentId,
    };
  }

  function fireEffects(owner: Unit, trigger: TriggerSpec, effects: EffectSpec[], event: CombatEvent | null, phase: 'INTERCEPT' | 'REACTION'): CombatEvent | null {
    let currentEvent = event;
    const role: 'SOURCE' | 'TARGET' = owner.id === currentEvent?.sourceId ? 'SOURCE' : 'TARGET';
    if (currentEvent && 'when' in trigger && trigger.when && !whenMatched(trigger.when, currentEvent, role)) {
      return currentEvent;
    }
    for (const effect of effects) {
      const handler = effectHandlers[effect.kind];
      if (!handler) {
        throw new Error(`No handler for effect kind: ${effect.kind}`);
      }
      const result = handler(
        createEffectContext({
          owner,
          effect,
          event: currentEvent,
          trigger,
          phase,
          role,
          depth: currentEvent?.depth ?? 0,
          parentId: currentEvent?.id,
        }),
      );
      debugLog('trigger.effect', {
        ownerId: owner.id,
        ownerName: owner.name,
        triggerOn: trigger.on,
        effectKind: effect.kind,
        phase,
        role,
        eventId: currentEvent?.id,
        eventType: currentEvent?.type,
      });
      if (typeof result !== 'undefined') {
        currentEvent = result;
        if (!currentEvent) return null;
      }
    }
    return currentEvent;
  }

  function runModifierTriggers(owner: Unit, triggerOn: TriggerSpec['on'], event: CombatEvent | null, phase: 'INTERCEPT' | 'REACTION'): CombatEvent | null {
    let currentEvent = event;
    const pool = owner.id === 'ENV' ? sortedEnvModifiers() : sortedUnitModifiers(owner);
    for (const modifier of pool) {
      const key = `${round}:${owner.id}:${modifier.id}:${triggerOn}`;
      const count = triggerCount.get(key) ?? 0;
      if (count >= limits.maxTriggersPerModifierPerRound) {
        continue;
      }
      triggerCount.set(key, count + 1);
      const triggers = modifier.triggers ?? [];
      for (const spec of triggers) {
        if (spec.trigger.on === triggerOn) {
          debugLog('trigger.matched', {
            ownerId: owner.id,
            ownerName: owner.name,
            modifierId: modifier.id,
            modifierName: modifier.name,
            triggerOn,
            phase,
            eventId: currentEvent?.id,
            eventType: currentEvent?.type,
          });
          currentEvent = fireEffects(owner, spec.trigger, spec.effects, currentEvent, phase);
        }
        if (triggerOn === 'POST_ACTION' && spec.trigger.on === 'ON_HIT' && currentEvent && currentEvent.type === 'ATTACK' && currentEvent.sourceId === owner.id && !currentEvent.payload.tags.includes('miss')) {
          debugLog('trigger.matched', {
            ownerId: owner.id,
            ownerName: owner.name,
            modifierId: modifier.id,
            modifierName: modifier.name,
            triggerOn: 'ON_HIT',
            phase,
            eventId: currentEvent.id,
            eventType: currentEvent.type,
          });
          currentEvent = fireEffects(owner, spec.trigger, spec.effects, currentEvent, phase);
        }
        if (triggerOn === 'POST_ACTION' && spec.trigger.on === 'ON_HURT' && currentEvent && currentEvent.type === 'ATTACK' && currentEvent.targetId === owner.id && !currentEvent.payload.tags.includes('miss')) {
          debugLog('trigger.matched', {
            ownerId: owner.id,
            ownerName: owner.name,
            modifierId: modifier.id,
            modifierName: modifier.name,
            triggerOn: 'ON_HURT',
            phase,
            eventId: currentEvent.id,
            eventType: currentEvent.type,
          });
          currentEvent = fireEffects(owner, spec.trigger, spec.effects, currentEvent, phase);
        }
      }
    }
    return currentEvent;
  }

  function applyBattleEffect(owner: Unit, effect: EffectSpec, depth: number, parentId?: string): void {
    const handler = effectHandlers[effect.kind];
    if (!handler) {
      throw new Error(`No handler for effect kind: ${effect.kind}`);
    }
    handler(
      createEffectContext({
        owner,
        effect,
        event: null,
        trigger: { on: 'POST_ACTION' },
        phase: 'REACTION',
        role: 'SOURCE',
        depth,
        parentId,
      }),
    );
  }

  function triggerPool(poolId: string, ownerId: string, depth: number, parentId?: string): void {
    const pool = eventPools[poolId];
    if (!pool || pool.entries.length === 0) return;
    const picked = rng.weightedPick(pool.entries, (entry) => entry.weight, `pool:${poolId}`);
    if (!picked) return;

    const owner = getUnit(ownerId);
    pushLog({
      round,
      turn,
      text: resolveSystemLog('envEventTriggered', {
        eventName: picked.name,
        eventId: picked.id,
        poolId,
        poolDomain: pool.domain,
        depth,
        parentEventId: parentId,
        actorId: owner.id,
        actorName: owner.name,
      }),
      tags: ['env'],
      actorId: owner.id,
      actorName: owner.name,
    });
    for (const effect of picked.effects) {
      applyBattleEffect(owner, effect, depth, parentId);
    }
  }

  function consumeById(owner: Unit, itemId: string): void {
    const consumableIds = [...(owner.state.consumables ?? [])];
    if (!consumableIds.includes(itemId)) return;
    const consumable = getConsumableById(itemId);
    owner.state.consumables = consumableIds.filter((id, index) => id !== itemId || index !== consumableIds.indexOf(itemId));
    pushLog({
      round,
      turn,
      text: resolveSystemLog('useConsumable', {
        unitId: owner.id,
        unitName: owner.name,
        sourceId: itemId,
        sourceName: consumable?.name,
        itemName: consumable?.name,
      }),
      tags: ['buff'],
      actorId: owner.id,
      actorName: owner.name,
    });
    for (const effect of consumable?.effects ?? []) {
      const normalized: EffectSpec = 'target' in effect && effect.target ? effect : ({ ...effect, target: 'SELF' } as EffectSpec);
      applyBattleEffect(owner, normalized, 0);
    }
  }

  function runTurnConsumable(owner: Unit): boolean {
    return runTurnConsumableExecutor({
      actor: owner,
      runtime,
      round,
      getConsumableById,
      getConsumableIds: () => [...(owner.state.consumables ?? [])],
      pickRandomFrom,
      consumeById: (consumableId) => consumeById(owner, consumableId),
    });
  }

  function resolveEvent(event: CombatEvent): void {
    const source = getUnit(event.sourceId);
    const target = getUnit(event.targetId);

    if (event.type === 'ATTACK') {
      const value = runtimeMath.nonNegativeInt(event.payload.value ?? 0);
      let actualDamage = 0;
      const hpBefore = target.state.hp;
      const shieldBefore = target.state.shield;
      if (value > 0) {
        const split = runtimeMath.splitDamageByShield(value, target.state.shield);
        target.state.shield = runtimeMath.safeShield(split.shieldAfter);
        actualDamage = split.hpDamage;
        target.state.hp = runtimeMath.safeHp(runtimeMath.hpAfterDamage(target.state.hp, actualDamage), target.state.maxHp);
        totalDamageByUnit[source.id] = (totalDamageByUnit[source.id] ?? 0) + actualDamage;
      }
      debugLog('event.resolved.attack', {
        eventId: event.id,
        sourceId: source.id,
        targetId: target.id,
        incoming: value,
        actualDamage,
        hpBefore,
        hpAfter: target.state.hp,
        shieldBefore,
        shieldAfter: target.state.shield,
        tags: event.payload.tags,
      });

      const narration = narrate(event, source.name, target.name, rng.next('narration'), recentNarrationKeys.slice(-3));
      recentNarrationKeys.push(narration.key);
      pushLog({
        round,
        turn,
        text: narration.text,
        tags: event.payload.tags,
        eventId: event.id,
        eventType: event.type,
        actorId: source.id,
        actorName: source.name,
        targetId: target.id,
        targetName: target.name,
        seq: event.meta.seq,
      });

      if (target.state.hp <= 0) {
        processEvent(
          makeEvent({
            type: 'DEATH',
            sourceId: source.id,
            targetId: target.id,
            payload: { tags: [] },
            depth: event.depth + 1,
            parentId: event.id,
          }),
        );
      }
      return;
    }

    if (event.type === 'HEAL') {
      const amount = runtimeMath.nonNegativeInt(event.payload.value ?? 0);
      const hpBefore = target.state.hp;
      target.state.hp = runtimeMath.hpAfterHeal(target.state.hp, target.state.maxHp, amount);
      const healLogKey: BattleSystemLogKey = event.payload.tags.includes('env') ? 'eventHeal' : 'heal';
      debugLog('event.resolved.heal', {
        eventId: event.id,
        sourceId: source.id,
        targetId: target.id,
        amount,
        hpBefore,
        hpAfter: target.state.hp,
        tags: event.payload.tags,
        logKey: healLogKey,
      });
      pushLog({
        round,
        turn,
        text: resolveSystemLog(healLogKey, {
          sourceName: source.name,
          sourceId: source.id,
          targetName: target.name,
          targetId: target.id,
          amount,
          healValue: amount,
          hpBefore,
          hpAfter: target.state.hp,
          targetMaxHp: target.state.maxHp,
          targetShield: target.state.shield,
          eventId: event.id,
          eventType: event.type,
        }),
        tags: event.payload.tags,
        eventId: event.id,
        eventType: event.type,
        actorId: source.id,
        actorName: source.name,
        targetId: target.id,
        targetName: target.name,
        seq: event.meta.seq,
      });
      return;
    }

    if (event.type === 'APPLY_BUFF' && event.payload.modifier) {
      applyModifier(target.id, event.payload.modifier);
      pushLog({
        round,
        turn,
        text: resolveSystemLog('applyBuff', {
          sourceName: source.name,
          sourceId: source.id,
          targetName: target.name,
          targetId: target.id,
          targetHp: target.state.hp,
          targetMaxHp: target.state.maxHp,
          targetShield: target.state.shield,
          modifierName: event.payload.modifier.name,
          modifierId: event.payload.modifier.id,
          modifierSource: event.payload.modifier.source,
          modifierDuration: event.payload.modifier.duration,
          eventId: event.id,
          eventType: event.type,
        }),
        tags: ['buff'],
        eventId: event.id,
        eventType: event.type,
        actorId: target.id,
        actorName: target.name,
        targetId: target.id,
        targetName: target.name,
        seq: event.meta.seq,
      });
      return;
    }

    if (event.type === 'REMOVE_BUFF' && event.payload.modifier) {
      removeModifier(target.id, event.payload.modifier.id, event.payload.modifier.stacking?.stackKey, 1);
      pushLog({
        round,
        turn,
        text: resolveSystemLog('removeBuff', {
          sourceName: source.name,
          sourceId: source.id,
          targetName: target.name,
          targetId: target.id,
          targetHp: target.state.hp,
          targetMaxHp: target.state.maxHp,
          targetShield: target.state.shield,
          modifierName: event.payload.modifier.name,
          modifierId: event.payload.modifier.id,
          modifierSource: event.payload.modifier.source,
          modifierDuration: event.payload.modifier.duration,
          eventId: event.id,
          eventType: event.type,
        }),
        tags: ['debuff'],
        eventId: event.id,
        eventType: event.type,
        actorId: target.id,
        actorName: target.name,
        targetId: target.id,
        targetName: target.name,
        seq: event.meta.seq,
      });
      return;
    }

    if (event.type === 'DEATH') {
      pushLog({
        round,
        turn,
        text: resolveSystemLog('death', {
          sourceName: source.name,
          sourceId: source.id,
          targetName: target.name,
          targetId: target.id,
          targetHp: target.state.hp,
          targetMaxHp: target.state.maxHp,
          targetShield: target.state.shield,
          eventId: event.id,
          eventType: event.type,
        }),
        tags: [],
        eventId: event.id,
        eventType: event.type,
        actorId: source.id,
        actorName: source.name,
        targetId: target.id,
        targetName: target.name,
        seq: event.meta.seq,
      });
    }
  }

  // 收集衍生事件 (Reactor 模式)
  // 当一个事件(如攻击)完成后，收集由此触发的其他事件(如反伤、吸血、受击触发的效果等)
  function collectDerivedFromHooks(event: CombatEvent): CombatEvent[] {
    const source = getUnit(event.sourceId);
    const target = getUnit(event.targetId);
    const derived: CombatEvent[] = [];

    const runReactor = (owner: Unit, modifier: Modifier): void => {
      const ctx: InteractionContext = { engine: runtime, owner, source, target };
      // 执行 onPostAction 钩子，收集返回值作为新事件
      const hooksDerived = modifier.hooks?.onPostAction?.(event, ctx) ?? [];
      for (const child of hooksDerived.slice(0, limits.maxDerivedEventsPerEvent)) {
        derived.push({ ...child, parentId: event.id, depth: event.depth + 1, meta: { round, turn, seq: ++eventSeq } });
      }
    };

    // 遍历所有相关单位的 Modifier
    for (const modifier of sortedUnitModifiers(source)) runReactor(source, modifier);
    for (const modifier of sortedUnitModifiers(target)) runReactor(target, modifier);
    for (const modifier of sortedEnvModifiers()) runReactor(envUnit, modifier);

    // 触发 POST_ACTION 类型的触发器 (通常用于处理 Buff 移除等无衍生事件的副作用)
    runModifierTriggers(source, 'POST_ACTION', event, 'REACTION');
    runModifierTriggers(target, 'POST_ACTION', event, 'REACTION');
    runModifierTriggers(envUnit, 'POST_ACTION', event, 'REACTION');

    return derived.slice(0, limits.maxDerivedEventsPerEvent);
  }

  // 核心事件处理管道 (Pipeline)
  // 负责事件的生命周期：创建 -> 拦截/修改(Intercept) -> 结算(Resolve) -> 衍生(Derived)
  function processEvent(event: CombatEvent): void {
    // 1. 深度和数量限制，防止无限递归 (如: 反伤触发反伤)
    if (event.depth > limits.maxEventDepth || roundEventCount >= limits.maxEventsPerRound) {
      debugLog('event.skipped.limit', {
        eventId: event.id,
        type: event.type,
        depth: event.depth,
        roundEventCount,
      });
      return;
    }

    // 2. 事件去重，防止完全相同的事件被重复处理
    const dedupKey = `${event.parentId ?? event.id}:${event.type}:${event.sourceId}:${event.targetId}:${event.payload.tags.join('|')}:${event.payload.value ?? ''}`;
    if (dedup.has(dedupKey)) {
      debugLog('event.skipped.dedup', {
        eventId: event.id,
        type: event.type,
        sourceId: event.sourceId,
        targetId: event.targetId,
        tags: event.payload.tags,
      });
      return;
    }
    dedup.add(dedupKey);
    debugLog('event.process.start', {
      eventId: event.id,
      type: event.type,
      sourceId: event.sourceId,
      targetId: event.targetId,
      value: event.payload.value,
      tags: event.payload.tags,
      depth: event.depth,
      parentId: event.parentId,
    });

    const source = getUnit(event.sourceId);
    const target = getUnit(event.targetId);
    
    // 3. 死亡检查 (死人无法行动，除非是复活等特殊事件)
    if (!unitAlive(source) && event.type !== 'DEATH') {
      debugLog('event.skipped.source-dead', { eventId: event.id, sourceId: source.id, type: event.type });
      return;
    }
    if (!unitAlive(target) && !['HEAL', 'DEATH'].includes(event.type)) {
      debugLog('event.skipped.target-dead', { eventId: event.id, targetId: target.id, type: event.type });
      return;
    }

    let current: CombatEvent | null = { ...event, payload: { ...event.payload, tags: [...event.payload.tags] } };

    // 4. 环境 (Environment) 拦截阶段
    // 环境效果 (如: 停电导致命中率下降) 优先处理
    for (const modifier of sortedEnvModifiers()) {
      const ctx: InteractionContext = { engine: runtime, owner: envUnit, source, target };
      current = modifier.hooks?.onOutgoing?.(current, ctx) ?? current;
      if (!current) return; // 事件被取消
      current = modifier.hooks?.onIncoming?.(current, ctx) ?? current;
      if (!current) return;
    }
    current = runModifierTriggers(envUnit, 'PIPELINE_OUTGOING', current, 'INTERCEPT');
    if (!current) return;
    current = runModifierTriggers(envUnit, 'PIPELINE_INCOMING', current, 'INTERCEPT');
    if (!current) return;

    // 5. 发起者 (Source) 拦截阶段 (Outgoing)
    // 处理发起者的 Buff/Debuff (如: 增加攻击力)
    for (const modifier of sortedUnitModifiers(source)) {
      const ctx: InteractionContext = { engine: runtime, owner: source, source, target };
      current = modifier.hooks?.onOutgoing?.(current, ctx) ?? current;
      if (!current) return;
    }
    current = runModifierTriggers(source, 'PIPELINE_OUTGOING', current, 'INTERCEPT');
    if (!current) return;

    // 6. 目标 (Target) 拦截阶段 (Incoming)
    // 处理目标的 Buff/Debuff (如: 减伤、闪避)
    for (const modifier of sortedUnitModifiers(target)) {
      const ctx: InteractionContext = { engine: runtime, owner: target, source, target };
      current = modifier.hooks?.onIncoming?.(current, ctx) ?? current;
      if (!current) return;
    }
    current = runModifierTriggers(target, 'PIPELINE_INCOMING', current, 'INTERCEPT');
    if (!current) return;

    // 7. 结算阶段 (Resolve)
    // 事件最终生效，执行伤害扣除、治疗回血等实质性操作
    roundEventCount += 1;
    resolveEvent(current);

    // 8. 衍生事件处理 (Derived)
    // 递归处理该事件引发的新事件
    for (const child of collectDerivedFromHooks(current)) {
      processEvent(child);
    }
  }

  function triggerRoundStart(): void {
    for (const modifier of sortedEnvModifiers()) {
      modifier.hooks?.onRoundStart?.({ engine: runtime, owner: envUnit });
    }
    runModifierTriggers(envUnit, 'ROUND_START', null, 'REACTION');

    for (const unit of units.filter(unitAlive)) {
      for (const modifier of sortedUnitModifiers(unit)) {
        modifier.hooks?.onRoundStart?.({ engine: runtime, owner: unit });
      }
      runModifierTriggers(unit, 'ROUND_START', null, 'REACTION');
    }
  }

  function triggerRoundEnd(): void {
    for (const modifier of sortedEnvModifiers()) {
      modifier.hooks?.onRoundEnd?.({ engine: runtime, owner: envUnit });
    }
    for (const unit of units.filter(unitAlive)) {
      for (const modifier of sortedUnitModifiers(unit)) {
        modifier.hooks?.onRoundEnd?.({ engine: runtime, owner: unit });
      }
    }
  }

  function tickModifierDurations(list: Modifier[]): void {
    for (let index = list.length - 1; index >= 0; index -= 1) {
      const modifier = list[index];
      if (typeof modifier.duration === 'number' && modifier.duration > 0) {
        modifier.duration -= 1;
        if (modifier.duration <= 0) {
          list.splice(index, 1);
        }
      }
    }
  }

  function decrementCooldowns(): void {
    for (const unit of units) {
      Object.keys(unit.state.cd).forEach((skillId) => {
        unit.state.cd[skillId] = runtimeMath.nonNegativeInt((unit.state.cd[skillId] ?? 0) - 1, 999);
      });
    }
  }

  function getEffectiveStat(unit: Unit, stat: keyof BaseStats): number {
    const selfBonus = unit.modifiers.reduce((sum, modifier) => sum + (modifier.statBonus?.[stat] ?? 0), 0);
    const envBonus = envModifiers.reduce((sum, modifier) => sum + (modifier.statBonus?.[stat] ?? 0), 0);
    return runtimeMath.safeStat(unit.stats[stat] + selfBonus + envBonus);
  }

  function performAction(unit: Unit): void {
    const enemy = getEnemy(unit.id);
    runTurnAction({
      actor: unit,
      enemy,
      runtime,
      round,
      executeTurnConsumable: () => runTurnConsumable(unit),
      getEffectiveStat,
    });
  }

  snapshots.push(createSnapshot());

  // === 战斗主循环 ===
  // 持续直到只剩一个存活单位或达到最大回合数
  while (units.filter(unitAlive).length > 1 && round < finalConfig.maxRounds) {
    round += 1;
    turn = 0;
    roundEventCount = 0;
    triggerCount.clear(); // 清空每回合的触发计数器
    dedup.clear();        // 清空事件去重缓存
    snapshots.push(createSnapshot());

    // 1. 回合开始 (RoundStart)
    triggerRoundStart();

    // 处理全局回合开始事件 (如: 随机天气、突发新闻)
    for (const rule of scheduler.getRules('RoundStart')) {
      if (rng.bool(rule.chance, { domain: 'EVENT', luk: Math.max(...units.map((unit) => unit.stats.LUK)) }, `scheduler:${rule.poolId}:start`)) {
        triggerPool(rule.poolId, 'ENV', 0);
      }
    }

    decrementCooldowns();

    // 2. 确定行动顺序 (基于 AGI 敏捷属性)
    const queue = units
      .filter(unitAlive)
      .sort((left, right) => {
        const agiDiff = getEffectiveStat(right, 'AGI') - getEffectiveStat(left, 'AGI');
        if (agiDiff !== 0) return agiDiff;
        return left.id.localeCompare(right.id);
      });

    // 3. 逐个单位行动 (Turn)
    for (const acting of queue) {
      if (!unitAlive(acting) || units.filter(unitAlive).length <= 1) {
        continue;
      }
      turn += 1;

      // TurnStart 钩子
      for (const modifier of sortedUnitModifiers(acting)) {
        modifier.hooks?.onTurnStart?.({ engine: runtime, owner: acting });
      }
      runModifierTriggers(acting, 'TURN_START', null, 'REACTION');

      // 个人突发事件检查
      for (const rule of scheduler.getRules('TurnStart')) {
        if (rng.bool(rule.chance, { domain: 'EVENT', luk: acting.stats.LUK }, `scheduler:${rule.poolId}:turn-start:${acting.id}`)) {
          triggerPool(rule.poolId, acting.id, 0);
        }
      }

      // 检查控制效果 (眩晕、冰冻等)
      const controlSource = runControlResolver({ actor: acting, envModifiers: sortedEnvModifiers() });
      if (controlSource) {
        pushLog({
          round,
          turn,
          text: resolveSystemLog('controlSkip', {
            unitName: acting.name,
            unitId: acting.id,
            unitHp: acting.state.hp,
            unitMaxHp: acting.state.maxHp,
            unitShield: acting.state.shield,
            sourceType: controlSource.source === 'ENV' ? 'event' : 'talent',
            sourceId: controlSource.id,
            sourceName: controlSource.name,
            modifierId: controlSource.id,
            modifierName: controlSource.name,
            modifierSource: controlSource.source,
          }),
          tags: ['control'],
          actorId: acting.id,
          actorName: acting.name,
        });
      } else {
        // 执行核心行动 (Attack / Skill)
        performAction(acting);
      }

      // TurnEnd 钩子
      for (const modifier of sortedUnitModifiers(acting)) {
        modifier.hooks?.onTurnEnd?.({ engine: runtime, owner: acting });
      }

      for (const rule of scheduler.getRules('TurnEnd')) {
        if (rng.bool(rule.chance, { domain: 'EVENT', luk: acting.stats.LUK }, `scheduler:${rule.poolId}:turn-end:${acting.id}`)) {
          triggerPool(rule.poolId, acting.id, 0);
        }
      }

      tickModifierDurations(acting.modifiers);
    }

    // 4. 回合结束 (RoundEnd)
    triggerRoundEnd();
    tickModifierDurations(envModifiers); // 环境修饰器按回合结算持续时间

    for (const rule of scheduler.getRules('RoundEnd')) {
      if (rng.bool(rule.chance, { domain: 'EVENT', luk: Math.max(...units.map((unit) => unit.stats.LUK)) }, `scheduler:${rule.poolId}:end`)) {
        triggerPool(rule.poolId, 'ENV', 0);
      }
    }
  }
  const alive = units.filter(unitAlive);
  const winner = alive[0] ?? units.sort((left, right) => right.state.hp - left.state.hp)[0];

  return {
    seed,
    winnerId: winner.id,
    logs,
    snapshots,
    summary: {
      totalRounds: round,
      totalDamageByUnit,
    },
    replay: {
      engineVersion: ENGINE_VERSION,
      seed,
      initialState: snapshots[0],
      rngTrace: rng.getTrace(),
      eventTrace: logs
        .filter((log) => log.eventId)
        .map((log) => ({
          eventId: log.eventId as string,
          type: 'LOG',
          meta: { round: log.round, turn: log.turn, seq: log.seq },
          tags: log.tags,
        })),
    },
  };
}
