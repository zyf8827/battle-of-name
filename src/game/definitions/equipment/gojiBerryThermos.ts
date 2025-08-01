import type { Equipment } from '../../types';

export const gojiBerryThermos: Equipment = {
  id: 'gojiBerryThermos',
  name: '枸杞保温杯 🍵',
  type: 'accessory',
  description: '中年养生的必备单品，提供持续的生命恢复。',
  stats: {
    maxHp: 10,
  },
  hooks: {
    onTurnEnd: (self, state) => {
      const healAmount = Math.floor(self.stats.maxHp * 0.05);
      self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
      state.logEvent(
        `${self.name} 喝了一口枸杞保温杯里的热水，恢复了 ${healAmount} 点生命值。`,
      );
    },
  },
};
