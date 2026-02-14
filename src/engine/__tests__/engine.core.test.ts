import { describe, expect, it } from 'vitest';

import { defaultBattleContentAdapter } from '../../content/battleContentAdapter';
import type { BattleContentAdapter } from '../contentAdapter';
import { runBattle } from '../engine';
import type { Modifier, Unit } from '../types';

describe('engine core robustness', () => {
  it('is deterministic for same input and same seed', () => {
    const input = { name1: '张三', name2: '李四', seed: 'ut-seed-1' };
    const resultA = runBattle(input, defaultBattleContentAdapter);
    const resultB = runBattle(input, defaultBattleContentAdapter);

    expect(resultA.winnerId).toBe(resultB.winnerId);
    expect(resultA.logs.map((log) => log.text)).toEqual(resultB.logs.map((log) => log.text));
    expect(resultA.replay.rngTrace).toEqual(resultB.replay.rngTrace);
  });

  it('throws if adapter returns less than two units', () => {
    const badAdapter = {
      bootstrap: () => {
        const base = defaultBattleContentAdapter.bootstrap({
          name1: '甲',
          name2: '乙',
          seed: 'bad-seed',
        });
        return { ...base, units: base.units.slice(0, 1) };
      },
    };

    expect(() => runBattle({ name1: '甲', name2: '乙', seed: 'bad-seed' }, badAdapter)).toThrow(
      'Battle requires at least 2 units from content adapter',
    );
  });

  it('ensures all hp values stay within [0, maxHp]', () => {
    const result = runBattle(
      { name1: '王五', name2: '赵六', seed: 'hp-bound-seed' },
      defaultBattleContentAdapter,
    );

    for (const snapshot of result.snapshots) {
      for (const unit of snapshot.units) {
        expect(unit.state.maxHp).toBeGreaterThan(0);
        expect(unit.state.hp).toBeGreaterThanOrEqual(0);
        expect(unit.state.hp).toBeLessThanOrEqual(unit.state.maxHp);
      }
    }
  });

  it('caps rounds and avoids endless loop', () => {
    const result = runBattle(
      { name1: '周七', name2: '吴八', seed: 'round-cap-seed' },
      defaultBattleContentAdapter,
    );
    const maxRound = result.logs.reduce((max, log) => Math.max(max, log.round), 0);
    expect(maxRound).toBeLessThanOrEqual(50);
  });

  it('does not mutate content adapter bootstrap outputs across runs', () => {
    const input = { name1: 'A', name2: 'B', seed: 'immut-seed' };
    const before = defaultBattleContentAdapter.bootstrap(input);
    const beforeSerialized = JSON.stringify(before);

    runBattle(input, defaultBattleContentAdapter);

    const after = defaultBattleContentAdapter.bootstrap(input);
    const afterSerialized = JSON.stringify(after);

    expect(afterSerialized).toBe(beforeSerialized);
  });
});

function createTestAdapter(params: {
  agiA: number;
  agiB: number;
  shouldStun: (ctx: { actor: Unit; enemy: Unit; round: number }) => boolean;
}): BattleContentAdapter {
  const makeStun = (): Modifier => ({
    id: 'test.stun',
    source: 'BUFF',
    name: '眩晕',
    duration: 1,
    tags: ['control', 'debuff'],
    stacking: { stackKey: 'test.stun', policy: 'REFRESH_DURATION' },
  });

  return {
    bootstrap: () => ({
      units: [
        {
          id: 'A',
          name: 'A',
          stats: { STR: 10, AGI: params.agiA, VIT: 10, LUK: 0 },
          state: { hp: 100, maxHp: 100, shield: 0, cd: {} },
          modifiers: [],
        },
        {
          id: 'B',
          name: 'B',
          stats: { STR: 10, AGI: params.agiB, VIT: 10, LUK: 0 },
          state: { hp: 100, maxHp: 100, shield: 0, cd: {} },
          modifiers: [],
        },
      ],
      envModifiers: [],
      eventPools: {},
      consumablePoolIds: [],
      equipmentPoolIds: [],
      scheduleRules: [],
      narrate: () => ({ text: 'noop', key: 'noop' }),
      logText: (key) => key,
      createModifierById: () => makeStun(),
      getConsumableById: () => undefined,
      executeTurnAction: ({ actor, enemy, runtime, round }) => {
        if (!params.shouldStun({ actor, enemy, round })) {
          return;
        }
        runtime.event.process(
          runtime.event.make({
            type: 'APPLY_BUFF',
            sourceId: actor.id,
            targetId: enemy.id,
            depth: 0,
            payload: {
              modifier: makeStun(),
              tags: ['control', 'debuff'],
            },
          }),
        );
      },
      executeTurnConsumable: () => false,
      resolveControlSource: ({ actor }) =>
        actor.modifiers.find((modifier) => modifier.tags?.includes('control')),
    }),
  };
}

describe('duration ticking on control effects', () => {
  it('early actor stun makes late actor skip in same round only', () => {
    const adapter = createTestAdapter({
      agiA: 20,
      agiB: 10,
      shouldStun: ({ actor, round }) => actor.id === 'A' && round === 1,
    });

    const result = runBattle({ name1: 'A', name2: 'B', seed: 'turn-duration-1' }, adapter, {
      maxRounds: 2,
    });
    const skipLogs = result.logs
      .filter((log) => log.text === 'controlSkip')
      .map((log) => ({ round: log.round, actorId: log.actorId }));

    expect(skipLogs).toEqual([{ round: 1, actorId: 'B' }]);
  });

  it('late actor stun makes early actor skip on next round turn', () => {
    const adapter = createTestAdapter({
      agiA: 20,
      agiB: 10,
      shouldStun: ({ actor, round }) => actor.id === 'B' && round === 1,
    });

    const result = runBattle({ name1: 'A', name2: 'B', seed: 'turn-duration-2' }, adapter, {
      maxRounds: 2,
    });
    const skipLogs = result.logs
      .filter((log) => log.text === 'controlSkip')
      .map((log) => ({ round: log.round, actorId: log.actorId }));

    expect(skipLogs).toEqual([{ round: 2, actorId: 'A' }]);
  });
});
