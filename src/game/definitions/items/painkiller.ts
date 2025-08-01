import type { Item } from '../../types';

export const painkiller: Item = {
  id: 'painkiller',
  name: '止痛药 💊',
  description: '恢复50点生命值，但有副作用，会降低2点速度。',
  use: (self, state) => {
    const healAmount = 50;
    self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
    state.logEvent(
      `${self.name} 吃了一片止痛药，恢复了 ${healAmount} 点生命值，但速度下降了。`,
    );
  },
};
