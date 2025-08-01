import type { Item } from '../../types';

export const milkTea: Item = {
  id: 'milkTea',
  name: '奶茶 🧋',
  description: '恢复10点生命值，并提升2点速度。',
  use: (self, state) => {
    const healAmount = 10;
    self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
    state.logEvent(
      `${self.name} 喝了一杯奶茶，恢复了 ${healAmount} 点生命值，速度提升了。`,
    );
  },
};
