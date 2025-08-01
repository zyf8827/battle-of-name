import type { Item } from '../../types';

export const luckyCoin: Item = {
  id: 'luckyCoin',
  name: '幸运币 🪙',
  description: '下一次攻击必定暴击。',
  use: (self, state) => {
    state.addStatusEffect(self, {
      id: 'guaranteed_crit',
      name: '必定暴击',
      duration: 1,
      modifiers: {
        critRate: 1, // 暴击率设置为100%
      },
    });
    state.logEvent(`${self.name} 抛出了一枚幸运币，下一次攻击必定暴击！`);
  },
};
