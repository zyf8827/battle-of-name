import { describe, expect, it } from 'vitest';

import { defaultBattleContentAdapter } from '../battleContentAdapter';
import type { Modifier } from '../../engine/types';

function identitySignature(
  unit: ReturnType<typeof defaultBattleContentAdapter.bootstrap>['units'][number],
): string {
  const nonEquipModifiers = unit.modifiers
    .filter((modifier) => modifier.source !== 'EQUIP')
    .map((modifier) => modifier.id)
    .sort();
  return JSON.stringify({ stats: unit.stats, nonEquipModifiers });
}

function gearSignature(
  unit: ReturnType<typeof defaultBattleContentAdapter.bootstrap>['units'][number],
): string {
  const equips = unit.modifiers
    .filter((modifier) => modifier.source === 'EQUIP')
    .map((modifier) => modifier.id)
    .sort();
  const consumables = [...(unit.state.consumables ?? [])].sort();
  return JSON.stringify({ equips, consumables });
}

describe('battle content adapter rules', () => {
  it('keeps identity (stats/class/starting modifiers) stable for same names across different seeds', () => {
    const a = defaultBattleContentAdapter.bootstrap({
      name1: '张三',
      name2: '李四',
      seed: 'seed-a',
    });
    const b = defaultBattleContentAdapter.bootstrap({
      name1: '张三',
      name2: '李四',
      seed: 'seed-b',
    });

    expect(identitySignature(a.units[0])).toBe(identitySignature(b.units[0]));
    expect(identitySignature(a.units[1])).toBe(identitySignature(b.units[1]));
  });

  it('keeps gear deterministic for same names + same seed', () => {
    const a = defaultBattleContentAdapter.bootstrap({
      name1: '张三',
      name2: '李四',
      seed: 'same-seed',
    });
    const b = defaultBattleContentAdapter.bootstrap({
      name1: '张三',
      name2: '李四',
      seed: 'same-seed',
    });

    expect(gearSignature(a.units[0])).toBe(gearSignature(b.units[0]));
    expect(gearSignature(a.units[1])).toBe(gearSignature(b.units[1]));
  });

  it('makes gear sensitive to seed (for same names, multiple seeds produce more than one gear state)', () => {
    const signaturesU1 = new Set<string>();
    const signaturesU2 = new Set<string>();

    for (let i = 0; i < 24; i += 1) {
      const data = defaultBattleContentAdapter.bootstrap({
        name1: '张三',
        name2: '李四',
        seed: `seed-${i}`,
      });
      signaturesU1.add(gearSignature(data.units[0]));
      signaturesU2.add(gearSignature(data.units[1]));
    }

    expect(signaturesU1.size > 1 || signaturesU2.size > 1).toBe(true);
  });

  it('does not use generic modifier trigger text for heal system logs', () => {
    const data = defaultBattleContentAdapter.bootstrap({
      name1: '张三',
      name2: '李四',
      seed: 'heal-log-regression',
    });

    data.units[0].modifiers.push({
      id: 'test.generic.trigger',
      source: 'BUFF',
      name: '测试通用触发',
      texts: {
        trigger: ['这条通用触发文案不应该出现在治疗日志里'],
      },
    } as Modifier);

    const text = data.logText(
      'heal',
      {
        sourceId: 'u1',
        sourceName: data.units[0].name,
        targetId: 'u2',
        targetName: data.units[1].name,
        amount: 12,
      },
      0.13,
    );

    expect(text).not.toContain('这条通用触发文案不应该出现在治疗日志里');
  });

  it('supports heal override via triggerByTag.heal', () => {
    const data = defaultBattleContentAdapter.bootstrap({
      name1: '张三',
      name2: '李四',
      seed: 'heal-log-override',
    });

    data.units[0].modifiers.push({
      id: 'test.heal.tag.override',
      source: 'BUFF',
      name: '治疗文案覆盖',
      texts: {
        triggerByTag: {
          heal: ['{sourceName} 触发了治疗覆盖文案，恢复 {amount} 点生命。'],
        },
      },
    } as Modifier);

    const text = data.logText(
      'heal',
      {
        sourceId: 'u1',
        sourceName: data.units[0].name,
        targetId: 'u2',
        targetName: data.units[1].name,
        amount: 21,
      },
      0.29,
    );

    expect(text).toContain('治疗覆盖文案');
    expect(text).toContain('21');
  });

  it('keeps resolveLogText context resolver compatible with legacy logText', () => {
    const data = defaultBattleContentAdapter.bootstrap({
      name1: '张三',
      name2: '李四',
      seed: 'log-context-compatible',
    });

    const key = 'applyBuff';
    const variables = {
      sourceId: 'u1',
      sourceName: data.units[0].name,
      targetId: 'u2',
      targetName: data.units[1].name,
      modifierName: '测试增益',
      round: 1,
      turn: 1,
    };
    const rngValue = 0.5;

    const legacy = data.logText(key, variables, rngValue);
    const next = data.resolveLogText?.({
      key,
      variables,
      rngValue,
      round: 1,
      turn: 1,
    });

    expect(next).toBe(legacy);
  });
});
