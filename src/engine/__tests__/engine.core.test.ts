import { describe, expect, it } from 'vitest';

import { defaultBattleContentAdapter } from '../../content/battleContentAdapter';
import { runBattle } from '../engine';

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
        const base = defaultBattleContentAdapter.bootstrap({ name1: '甲', name2: '乙', seed: 'bad-seed' });
        return { ...base, units: base.units.slice(0, 1) };
      },
    };

    expect(() => runBattle({ name1: '甲', name2: '乙', seed: 'bad-seed' }, badAdapter)).toThrow(
      'Battle requires at least 2 units from content adapter',
    );
  });

  it('ensures all hp values stay within [0, maxHp]', () => {
    const result = runBattle({ name1: '王五', name2: '赵六', seed: 'hp-bound-seed' }, defaultBattleContentAdapter);

    for (const snapshot of result.snapshots) {
      for (const unit of snapshot.units) {
        expect(unit.state.maxHp).toBeGreaterThan(0);
        expect(unit.state.hp).toBeGreaterThanOrEqual(0);
        expect(unit.state.hp).toBeLessThanOrEqual(unit.state.maxHp);
      }
    }
  });

  it('caps rounds and avoids endless loop', () => {
    const result = runBattle({ name1: '周七', name2: '吴八', seed: 'round-cap-seed' }, defaultBattleContentAdapter);
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
