import type { Item } from '../../types';

export const luckyCoin: Item = {
  id: 'luckyCoin',
  name: '幸运币 🪙',
  description: '下一次攻击必定暴击。',
  use: (self, state) => {
    // Apply a guaranteed crit effect
    state.logEvent(`${self.name} 抛出了一枚幸运币，下一次攻击必定暴击！`);
  },
};
