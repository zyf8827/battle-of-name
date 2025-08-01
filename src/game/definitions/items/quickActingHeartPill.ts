import type { Item } from '../../types';

export const quickActingHeartPill: Item = {
  id: 'quickActingHeartPill',
  name: '速效救心丸 ❤️‍🩹',
  description: '在生命值低于20%时使用，可以恢复50%的最大生命值。',
  use: (self, state) => {
    if (self.stats.hp / self.stats.maxHp < 0.2) {
      const healAmount = Math.floor(self.stats.maxHp * 0.5);
      self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
      state.logEvent(
        `${self.name} 服用了速效救心丸，恢复了 ${healAmount} 点生命值！`,
      );
    } else {
      state.logEvent(`${self.name} 现在使用速效救心丸还为时过早。`);
    }
  },
};
