import type { Item } from '../../types';

export const powerPill: Item = {
  id: 'powerPill',
  name: '大力丸 💪',
  description: '提升10点攻击力，持续3回合。',
  use: (self, state) => {
    state.addStatusEffect(self, {
      id: 'power_pill_boost',
      name: '大力丸',
      duration: 3,
      modifiers: {
        atk: 10,
      },
    });
    state.logEvent(`${self.name} 吃了一颗大力丸，攻击力提升了！`);
  },
};
