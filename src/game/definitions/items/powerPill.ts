import type { Item } from '../../types';

export const powerPill: Item = {
  id: 'powerPill',
  name: '大力丸 💪',
  description: '提升10点攻击力，持续3回合。',
  use: (self, state) => {
    // Apply a temporary attack boost
    state.logEvent(`${self.name} 吃了一颗大力丸，攻击力提升了！`);
  },
};
