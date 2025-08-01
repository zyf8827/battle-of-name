import type { Item } from '../../types';

export const powerBank: Item = {
  id: 'powerBank',
  name: '充电宝 🔋',
  description: '恢复自己20%的最大生命值。',
  use: (self, state) => {
    const healAmount = Math.floor(self.stats.maxHp * 0.2);
    self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
    state.logEvent(`${self.name} 使用了充电宝，恢复了 ${healAmount} 点生命值。`);
  },
};
