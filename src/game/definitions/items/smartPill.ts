import type { Item } from '../../types';

export const smartPill: Item = {
  id: 'smartPill',
  name: '聪明药 💊',
  description: '提升10%的暴击率，持续3回合。',
  use: (self, state) => {
    // Apply a temporary crit rate boost
    state.logEvent(`${self.name} 吃了一颗聪明药，暴击率提升了！`);
  },
};
