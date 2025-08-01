import type { Career } from '../../types';

export const chef: Career = {
  id: 'chef',
  name: '大厨 👨‍🍳',
  description: '“尝尝我的手艺！” 能把普通的食材变成恢复生命值的美味佳肴。',
  modifiers: {
    hp: 15,
    atk: 5,
  },
  hooks: {
    onTurnStart: (self, state) => {
      if (self.stats.hp < self.stats.maxHp * 0.5 && state.checkProbability('chef-heal', 0.3)) {
        const healAmount = Math.floor(self.stats.maxHp * 0.15);
        self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
        state.logEvent(
          `${self.name} 给自己做了顿好的，恢复了 ${healAmount} 点生命值！`,
        );
      }
    },
  },
};
