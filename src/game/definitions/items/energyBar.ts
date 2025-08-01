import type { Item } from '../../types';

export const energyBar: Item = {
  id: 'energyBar',
  name: '能量棒 🍫',
  description: '恢复30点生命值。',
  use: (self, state) => {
    const healAmount = 30;
    self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
    state.logEvent(`${self.name} 吃了一根能量棒，恢复了 ${healAmount} 点生命值。`);
  },
};
