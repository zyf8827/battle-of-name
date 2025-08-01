import type { Item } from '../../types';

export const iceColdCoke: Item = {
  id: 'iceColdCoke',
  name: '冰阔落 🥤',
  description: '恢复15点生命值。',
  use: (self, state) => {
    const healAmount = 15;
    self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
    state.logEvent(`${self.name} 喝了一口冰阔落，恢复了 ${healAmount} 点生命值。`);
  },
};
