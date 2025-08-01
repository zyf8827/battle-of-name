import type { Item } from '../../types';

export const airFreshener: Item = {
  id: 'airFreshener',
  name: '空气清新剂 🌬️',
  description: '清除战场上所有的负面状态。',
  use: (self, state) => {
    // Clear all negative status effects
    state.logEvent(`${self.name} 使用了空气清新剂，清除了所有的负面状态。`);
  },
};
