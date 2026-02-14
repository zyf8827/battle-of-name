import type { Modifier } from '../../engine/types';
import { deepCloneKeepFns } from '../../engine/clone';

import shieldAtRoundStart from './buffs/shieldAtRoundStart';
import physicalMitigationStance from './buffs/physicalMitigationStance';

export const modifierList: Modifier[] = [
  shieldAtRoundStart,
  physicalMitigationStance,
];

export const modifierCatalog: Record<string, Modifier> = Object.fromEntries(
  modifierList.map((item) => [item.id, item]),
);

export function createModifierById(id: string, duration?: number): Modifier {
  const found = modifierCatalog[id];
  if (!found) {
    throw new Error(`Unknown modifier: ${id} (${duration ?? 'default'})`);
  }
  const cloned = deepCloneKeepFns(found);
  if (typeof duration === 'number') {
    cloned.duration = duration;
  }
  return cloned;
}
