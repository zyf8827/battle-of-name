import type { Item } from '../../types';

export const slipper: Item = {
  id: 'slipper',
  name: '拖鞋 🩴',
  description: '居家旅行，打人必备，造成15点伤害。',
  use: (self, state) => {
    const damage = 15;
    state.opponent.stats.hp = Math.max(0, state.opponent.stats.hp - damage);
    state.logEvent(
      `${self.name} 抄起拖鞋，给了 ${state.opponent.name} 一下，造成了 ${damage} 点伤害。`,
    );
  },
};
