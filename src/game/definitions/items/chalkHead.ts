import type { Item } from '../../types';

export const chalkHead: Item = {
  id: 'chalkHead',
  name: '粉笔头 ✏️',
  description: '对敌人造成5点伤害，并有几率使其命中率下降。',
  use: (self, state) => {
    const damage = 5;
    state.opponent.stats.hp = Math.max(0, state.opponent.stats.hp - damage);
    state.logEvent(
      `${self.name} 扔出了一个粉笔头，对 ${state.opponent.name} 造成了 ${damage} 点伤害。`,
    );
  },
};
