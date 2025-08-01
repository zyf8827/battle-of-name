import type { Item } from '../../types';

export const coffee: Item = {
  id: 'coffee',
  name: '咖啡 ☕',
  description: '恢复5点生命值，并大幅提升速度，但效果只持续2回合。',
  use: (self, state) => {
    const healAmount = 5;
    self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
    state.addStatusEffect(self, {
      id: 'coffee_boost',
      name: '咖啡提速',
      duration: 2,
      modifiers: {
        speed: 1.5, // 速度提升50%
      },
    });
    state.logEvent(
      `${self.name} 喝了一杯咖啡，恢复了 ${healAmount} 点生命值，速度大幅提升！`,
    );
  },
};
