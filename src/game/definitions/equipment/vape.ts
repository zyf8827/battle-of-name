import type { Equipment } from '../../types';

export const vape: Equipment = {
  id: 'vape',
  name: '电子烟 🚬',
  type: 'accessory',
  description: '吞云吐雾，放松心情，缓慢恢复生命值。',
  stats: {},
  hooks: {
    onTurnEnd: (self, state) => {
      const healAmount = Math.floor(self.stats.maxHp * 0.03);
      self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
      state.logEvent(`${self.name} 吸了一口电子烟，恢复了 ${healAmount} 点生命值。`);
    },
  },
};
