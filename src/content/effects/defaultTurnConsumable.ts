import type { TurnConsumableExecutor } from '../../engine/contentAdapter';

export const defaultTurnConsumableExecutor: TurnConsumableExecutor = ({ actor, runtime, getConsumableIds, pickRandomFrom, consumeById }) => {
  const consumableIds = getConsumableIds();
  if (consumableIds.length === 0) return false;
  if (!runtime.rng.bool(runtime.calc.chance(0.5), { domain: 'COMBAT', luk: actor.stats.LUK }, `consumable.use:${actor.id}`)) {
    return false;
  }
  const itemId = pickRandomFrom(consumableIds, `consumable.pick:${actor.id}`);
  if (!itemId) return false;
  consumeById(itemId);
  return true;
};
