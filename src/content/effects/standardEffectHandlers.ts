import type { EffectHandlerRegistry } from '../../engine/contentAdapter';
import type { CombatTag, EventWhen, Modifier, TargetSelector, ValueExpr } from '../../engine/types';

type ApplyModifierEffect = {
  kind: 'APPLY_MODIFIER';
  target?: 'SELF' | 'SOURCE' | 'TARGET' | 'ALL';
  duration?: number;
  textOverrides?: Modifier['texts'];
  modifierId?: string;
  modifier?: Modifier;
};

type TriggerPoolEffect = { kind: 'TRIGGER_EVENT_POOL'; poolId: string };
type ShieldEffect = { kind: 'SHIELD'; value: ValueExpr[]; tags: CombatTag[] };
type LifeStealEffect = { kind: 'LIFESTEAL'; ratio: number; tags: CombatTag[] };
type DispelEffect = {
  kind: 'DISPEL';
  target: TargetSelector;
  mode: 'BUFF' | 'DEBUFF' | 'ANY';
  byTag?: CombatTag;
  max?: number;
};
type MitigateEffect = {
  kind: 'MITIGATE';
  when: EventWhen;
  multiplier: number;
  min?: number;
};
type DirectDamageEffect = {
  kind: 'DIRECT_DAMAGE';
  target: 'SELF' | 'SOURCE' | 'TARGET' | 'ALL';
  value: number;
  tags?: CombatTag[];
};
type DirectHealEffect = {
  kind: 'DIRECT_HEAL';
  target: 'SELF' | 'SOURCE' | 'TARGET' | 'ALL';
  value: number;
  tags?: CombatTag[];
};
type GrantConsumableEffect = {
  kind: 'GRANT_CONSUMABLE';
  target: 'SELF' | 'SOURCE' | 'TARGET' | 'ALL';
  consumableId: string;
};
type GrantRandomConsumableEffect = {
  kind: 'GRANT_RANDOM_CONSUMABLE';
  target: 'SELF' | 'SOURCE' | 'TARGET' | 'ALL';
};
type LoseRandomConsumableEffect = {
  kind: 'LOSE_RANDOM_CONSUMABLE';
  target: 'SELF' | 'SOURCE' | 'TARGET' | 'ALL';
  count?: number;
};
type GrantEquipmentEffect = {
  kind: 'GRANT_EQUIPMENT';
  target: 'SELF' | 'SOURCE' | 'TARGET' | 'ALL';
  equipment: Modifier;
};
type GrantRandomEquipmentEffect = {
  kind: 'GRANT_RANDOM_EQUIPMENT';
  target: 'SELF' | 'SOURCE' | 'TARGET' | 'ALL';
  slot?: 'WEAPON' | 'ARMOR' | 'ACCESSORY';
};
type LoseRandomEquipmentEffect = {
  kind: 'LOSE_RANDOM_EQUIPMENT';
  target: 'SELF' | 'SOURCE' | 'TARGET' | 'ALL';
  slot?: 'WEAPON' | 'ARMOR' | 'ACCESSORY';
};

export const standardEffectHandlers: EffectHandlerRegistry = {
  // 应用 Buff/Debuff
  APPLY_MODIFIER: (ctx) => {
    if (ctx.effect.kind !== 'APPLY_MODIFIER') return;
    const effect = ctx.effect as ApplyModifierEffect;
    const targets = ctx.runtime.state.resolveTargets(ctx.owner, effect.target ?? 'ALL');
    for (const target of targets) {
      ctx.runtime.state.applyModifierEffect(ctx.owner, target, effect);
    }
  },
  // 触发事件池 (从随机事件池中抽取并执行事件)
  TRIGGER_EVENT_POOL: (ctx) => {
    if (ctx.effect.kind !== 'TRIGGER_EVENT_POOL') return;
    if (ctx.phase !== 'REACTION') return;
    const effect = ctx.effect as TriggerPoolEffect;
    ctx.runtime.event.triggerPool(
      effect.poolId,
      ctx.owner.id,
      ctx.event?.depth ?? ctx.depth,
      ctx.event?.id ?? ctx.parentId,
    );
  },
  // 获得护盾
  SHIELD: (ctx) => {
    if (ctx.effect.kind !== 'SHIELD') return;
    const effect = ctx.effect as ShieldEffect;
    // 护盾值可以基于公式计算 (如: 力量的 50%)
    const amount = ctx.runtime.calc.nonNegativeInt(
      effect.value.reduce(
        (sum, valueExpr) =>
          sum + ctx.runtime.rule.evaluateValueExpr(ctx.owner, ctx.event ?? undefined, valueExpr),
        0,
      ),
    );
    if (amount <= 0) return;
    ctx.owner.state.shield = ctx.runtime.calc.safeShield(ctx.owner.state.shield + amount);
    ctx.runtime.log.system({
      key: 'gainShield',
      variables: {
        ownerName: ctx.owner.name,
        ownerId: ctx.owner.id,
        ownerHp: ctx.owner.state.hp,
        ownerMaxHp: ctx.owner.state.maxHp,
        ownerShield: ctx.owner.state.shield,
        actorName: ctx.owner.name,
        actorId: ctx.owner.id,
        amount,
        shieldGained: amount,
      },
      tags: effect.tags,
      actor: ctx.owner,
      target: ctx.owner,
    });
  },
  // 吸血效果
  LIFESTEAL: (ctx) => {
    if (ctx.effect.kind !== 'LIFESTEAL') return;
    const effect = ctx.effect as LifeStealEffect;
    if (!ctx.event) return;
    // 根据造成伤害的比例计算治疗量
    const amount = ctx.runtime.calc.scale(ctx.event.payload.value ?? 0, effect.ratio);
    if (amount <= 0) return;
    ctx.runtime.event.emitDirectHeal(
      ctx.owner,
      ctx.owner,
      amount,
      effect.tags,
      ctx.event.depth + 1,
      ctx.event.id,
    );
  },
  // 驱散效果 (移除 Buff/Debuff)
  DISPEL: (ctx) => {
    if (ctx.effect.kind !== 'DISPEL') return;
    const effect = ctx.effect as DispelEffect;
    if (!ctx.event) return;
    const target = ctx.runtime.state.resolveTargetFromEvent(ctx.owner, effect.target, ctx.event);
    const removed = ctx.runtime.state.removeModifiersByMatcher(
      target,
      (modifier) => {
        const isBuff = modifier.tags?.includes('buff') ?? false;
        const isDebuff = modifier.tags?.includes('debuff') ?? false;
        if (effect.mode === 'BUFF' && !isBuff) return false;
        if (effect.mode === 'DEBUFF' && !isDebuff) return false;
        if (effect.byTag && !(modifier.tags?.includes(effect.byTag) ?? false)) return false;
        return true;
      },
      effect.max ?? 1,
    );
    if (removed <= 0) return;
    ctx.runtime.log.system({
      key: 'dispel',
      variables: {
        ownerName: ctx.owner.name,
        ownerId: ctx.owner.id,
        targetName: target.name,
        targetId: target.id,
        targetHp: target.state.hp,
        targetMaxHp: target.state.maxHp,
        targetShield: target.state.shield,
        removedCount: removed,
      },
      tags: ['talent'],
      actor: ctx.owner,
      target,
    });
  },
  // 减伤 (在 Intercept 阶段修改事件的数值)
  MITIGATE: (ctx) => {
    if (ctx.effect.kind !== 'MITIGATE') return ctx.event;
    const effect = ctx.effect as MitigateEffect;
    if (!ctx.event) return ctx.event;
    if (!ctx.runtime.rule.whenMatched(effect.when, ctx.event, ctx.role)) {
      return ctx.event;
    }
    const value = ctx.runtime.calc.nonNegativeInt(
      Math.max(effect.min ?? 0, (ctx.event.payload.value ?? 0) * effect.multiplier),
    );
    // 返回修改后的事件
    return { ...ctx.event, payload: { ...ctx.event.payload, value } };
  },
  DIRECT_DAMAGE: (ctx) => {
    if (ctx.effect.kind !== 'DIRECT_DAMAGE') return;
    const effect = ctx.effect as DirectDamageEffect;
    const targets = ctx.runtime.state.resolveTargets(ctx.owner, effect.target);
    for (const target of targets) {
      ctx.runtime.event.emitDirectDamage(
        ctx.owner,
        target,
        effect.value,
        effect.tags,
        (ctx.event?.depth ?? ctx.depth) + 1,
        ctx.event?.id ?? ctx.parentId,
      );
    }
  },
  DIRECT_HEAL: (ctx) => {
    if (ctx.effect.kind !== 'DIRECT_HEAL') return;
    const effect = ctx.effect as DirectHealEffect;
    const targets = ctx.runtime.state.resolveTargets(ctx.owner, effect.target);
    for (const target of targets) {
      ctx.runtime.event.emitDirectHeal(
        ctx.owner,
        target,
        effect.value,
        effect.tags,
        (ctx.event?.depth ?? ctx.depth) + 1,
        ctx.event?.id ?? ctx.parentId,
      );
    }
  },
  GRANT_CONSUMABLE: (ctx) => {
    if (ctx.effect.kind !== 'GRANT_CONSUMABLE') return;
    const effect = ctx.effect as GrantConsumableEffect;
    const targets = ctx.runtime.state.resolveTargets(ctx.owner, effect.target);
    for (const target of targets) {
      ctx.runtime.state.grantConsumable(target, effect.consumableId);
    }
  },
  GRANT_RANDOM_CONSUMABLE: (ctx) => {
    if (ctx.effect.kind !== 'GRANT_RANDOM_CONSUMABLE') return;
    const effect = ctx.effect as GrantRandomConsumableEffect;
    const targets = ctx.runtime.state.resolveTargets(ctx.owner, effect.target);
    for (const target of targets) {
      ctx.runtime.state.grantRandomConsumable(target);
    }
  },
  LOSE_RANDOM_CONSUMABLE: (ctx) => {
    if (ctx.effect.kind !== 'LOSE_RANDOM_CONSUMABLE') return;
    const effect = ctx.effect as LoseRandomConsumableEffect;
    const targets = ctx.runtime.state.resolveTargets(ctx.owner, effect.target);
    for (const target of targets) {
      const count = ctx.runtime.calc.toInt(effect.count ?? 1, 1, 12);
      ctx.runtime.state.loseRandomConsumable(target, count);
    }
  },
  GRANT_EQUIPMENT: (ctx) => {
    if (ctx.effect.kind !== 'GRANT_EQUIPMENT') return;
    const effect = ctx.effect as GrantEquipmentEffect;
    const targets = ctx.runtime.state.resolveTargets(ctx.owner, effect.target);
    for (const target of targets) {
      ctx.runtime.state.grantEquipment(target, effect.equipment);
    }
  },
  GRANT_RANDOM_EQUIPMENT: (ctx) => {
    if (ctx.effect.kind !== 'GRANT_RANDOM_EQUIPMENT') return;
    const effect = ctx.effect as GrantRandomEquipmentEffect;
    const targets = ctx.runtime.state.resolveTargets(ctx.owner, effect.target);
    for (const target of targets) {
      ctx.runtime.state.grantRandomEquipment(target, effect.slot);
    }
  },
  LOSE_RANDOM_EQUIPMENT: (ctx) => {
    if (ctx.effect.kind !== 'LOSE_RANDOM_EQUIPMENT') return;
    const effect = ctx.effect as LoseRandomEquipmentEffect;
    const targets = ctx.runtime.state.resolveTargets(ctx.owner, effect.target);
    for (const target of targets) {
      ctx.runtime.state.loseRandomEquipment(target, effect.slot);
    }
  },
};
