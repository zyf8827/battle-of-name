import { describe, expect, it } from 'vitest';

import { classList } from '../classes';
import { consumables } from '../consumables';
import { equipments } from '../equipment';
import { eventEntries } from '../events/entries';

const PLACEHOLDER_RE = /\{([a-zA-Z0-9_]+)\}/g;

const SPEC_ALLOWED_VARIABLES = new Set<string>([
  'round',
  'turn',
  'seq',
  'source',
  'sourceName',
  'sourceId',
  'target',
  'targetName',
  'targetId',
  'value',
  'damage',
  'amount',
  'healValue',
  'shieldGained',
  'isCrit',
  'isMiss',
  'tags',
  'eventId',
  'eventName',
  'eventType',
  'poolId',
  'poolDomain',
  'depth',
  'parentEventId',
  'actorId',
  'actorName',
  'ownerId',
  'ownerName',
  'ownerHp',
  'ownerMaxHp',
  'ownerShield',
  'unitId',
  'unitName',
  'unitHp',
  'unitMaxHp',
  'unitShield',
  'targetHp',
  'targetMaxHp',
  'targetShield',
  'modifierId',
  'modifierName',
  'modifierSource',
  'modifierDuration',
  'sourceType',
  'itemName',
  'itemId',
  'equipmentName',
  'equipmentId',
  'oldEquipmentName',
  'oldEquipmentId',
  'removedCount',
  'roundBefore',
  'roundAfter',
]);

function collectPlaceholderMismatches(node: unknown, path: string, mismatches: string[], seen = new WeakSet<object>()): void {
  if (typeof node === 'string') {
    const vars = [...node.matchAll(PLACEHOLDER_RE)].map((match) => match[1]);
    for (const variable of vars) {
      if (!SPEC_ALLOWED_VARIABLES.has(variable)) {
        mismatches.push(`${path} -> {${variable}}`);
      }
    }
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((item, index) => collectPlaceholderMismatches(item, `${path}[${index}]`, mismatches, seen));
    return;
  }

  if (!node || typeof node !== 'object') {
    return;
  }

  if (seen.has(node as object)) {
    return;
  }
  seen.add(node as object);

  Object.entries(node as Record<string, unknown>).forEach(([key, value]) => {
    collectPlaceholderMismatches(value, `${path}.${key}`, mismatches, seen);
  });
}

describe('content template variables', () => {
  it('uses only spec-defined placeholders across content assets', () => {
    const mismatches: string[] = [];

    classList.forEach((item, index) => collectPlaceholderMismatches(item, `classList[${index}]`, mismatches));
    equipments.forEach((item, index) => collectPlaceholderMismatches(item, `equipments[${index}]`, mismatches));
    consumables.forEach((item, index) => collectPlaceholderMismatches(item, `consumables[${index}]`, mismatches));
    eventEntries.forEach((item, index) => collectPlaceholderMismatches(item, `eventEntries[${index}]`, mismatches));

    expect(mismatches).toEqual([]);
  });
});
