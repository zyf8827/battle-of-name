import type { TurnActionExecutor } from '../../engine/contentAdapter';
import type { CombatTag } from '../../engine/types';

const BALANCE = {
  attackScale: 1.7,
  enragePerRound: 0.04,
  maxEnrageBonus: 0.6,
  critChance: 0.17,
  critMultiplier: 1.5,
};

export const defaultTurnActionExecutor: TurnActionExecutor = ({
  actor,
  enemy,
  runtime,
  round,
  executeTurnConsumable,
  getEffectiveStat,
}) => {
  if (executeTurnConsumable()) {
    return;
  }

  const hitChance = runtime.calc.chance(0.82);
  const critChance = runtime.calc.critRate(BALANCE.critChance, actor.stats.LUK);
  const hit = runtime.rng.bool(
    hitChance,
    { domain: 'COMBAT', luk: actor.stats.LUK },
    'attack.hit',
  );
  const crit =
    hit &&
    runtime.rng.bool(
      critChance,
      { domain: 'COMBAT', luk: actor.stats.LUK },
      'attack.crit',
    );

  const enrageBonus = runtime.calc.clamp(
    Math.max(0, round - 1) * BALANCE.enragePerRound,
    0,
    BALANCE.maxEnrageBonus,
  );
  const enrage = 1 + enrageBonus;
  const attackBase =
    getEffectiveStat(actor, 'STR') * BALANCE.attackScale +
    runtime.rng.range(0, 4, 'attack.rand');
  const attack = runtime.calc.nonNegativeInt(attackBase * enrage);
  const baseDamage = crit
    ? runtime.calc.scale(attack, BALANCE.critMultiplier)
    : attack;

  runtime.event.process(
    runtime.event.make({
      type: 'ATTACK',
      sourceId: actor.id,
      targetId: enemy.id,
      depth: 0,
      payload: {
        value: hit ? baseDamage : 0,
        tags: [
          hit ? 'physical' : 'physical',
          ...(crit ? (['crit'] as CombatTag[]) : []),
          ...(!hit ? (['miss'] as CombatTag[]) : []),
        ],
        isCrit: crit,
        isMiss: !hit,
      },
    }),
  );
};
