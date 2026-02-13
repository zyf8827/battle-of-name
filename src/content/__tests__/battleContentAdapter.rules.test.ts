import { describe, expect, it } from 'vitest';

import { defaultBattleContentAdapter } from '../battleContentAdapter';

function identitySignature(unit: ReturnType<typeof defaultBattleContentAdapter.bootstrap>['units'][number]): string {
  const nonEquipModifiers = unit.modifiers
    .filter((modifier) => modifier.source !== 'EQUIP')
    .map((modifier) => modifier.id)
    .sort();
  return JSON.stringify({ stats: unit.stats, nonEquipModifiers });
}

function gearSignature(unit: ReturnType<typeof defaultBattleContentAdapter.bootstrap>['units'][number]): string {
  const equips = unit.modifiers
    .filter((modifier) => modifier.source === 'EQUIP')
    .map((modifier) => modifier.id)
    .sort();
  const consumables = [...(unit.state.consumables ?? [])].sort();
  return JSON.stringify({ equips, consumables });
}

describe('battle content adapter rules', () => {
  it('keeps identity (stats/class/starting modifiers) stable for same names across different seeds', () => {
    const a = defaultBattleContentAdapter.bootstrap({ name1: '张三', name2: '李四', seed: 'seed-a' });
    const b = defaultBattleContentAdapter.bootstrap({ name1: '张三', name2: '李四', seed: 'seed-b' });

    expect(identitySignature(a.units[0])).toBe(identitySignature(b.units[0]));
    expect(identitySignature(a.units[1])).toBe(identitySignature(b.units[1]));
  });

  it('keeps gear deterministic for same names + same seed', () => {
    const a = defaultBattleContentAdapter.bootstrap({ name1: '张三', name2: '李四', seed: 'same-seed' });
    const b = defaultBattleContentAdapter.bootstrap({ name1: '张三', name2: '李四', seed: 'same-seed' });

    expect(gearSignature(a.units[0])).toBe(gearSignature(b.units[0]));
    expect(gearSignature(a.units[1])).toBe(gearSignature(b.units[1]));
  });

  it('makes gear sensitive to seed (for same names, multiple seeds produce more than one gear state)', () => {
    const signaturesU1 = new Set<string>();
    const signaturesU2 = new Set<string>();

    for (let i = 0; i < 24; i += 1) {
      const data = defaultBattleContentAdapter.bootstrap({ name1: '张三', name2: '李四', seed: `seed-${i}` });
      signaturesU1.add(gearSignature(data.units[0]));
      signaturesU2.add(gearSignature(data.units[1]));
    }

    expect(signaturesU1.size > 1 || signaturesU2.size > 1).toBe(true);
  });
});
