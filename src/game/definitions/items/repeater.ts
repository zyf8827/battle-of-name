import type { Item } from '../../types';

export const repeater: Item = {
  id: 'repeater',
  name: '复读机 🔁',
  description: '重复上一次使用的技能，无需消耗物品。',
  use: (self, state) => {
    state.logEvent(`${self.name} 变成了一台复读机。`);
  },
};
