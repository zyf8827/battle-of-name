import type { Item } from '../../types';

export const smartPill: Item = {
  id: 'smartPill',
  name: '聪明药 💊',
  description: '提升10%的暴击率，持续3回合。',
  use: (self, state) => {
    state.addStatusEffect(self, {
      id: 'smart_pill_boost',
      name: '聪明药',
      duration: 3,
      modifiers: {
        critRate: 0.1,
      },
    });
    state.logEvent(`${self.name} 吃了一颗聪明药，暴击率提升了！`);
  },
};
