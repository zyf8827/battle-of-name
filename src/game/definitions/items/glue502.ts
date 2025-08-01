import type { Item } from '../../types';

export const glue502: Item = {
  id: 'glue502',
  name: '502胶水 💧',
  description: '使敌人无法更换装备，持续3回合。',
  use: (self, state) => {
    // Apply an equipment lock effect
    state.logEvent(`${self.name} 使用了502胶水，${state.opponent.name} 的装备被粘住了。`);
  },
};
