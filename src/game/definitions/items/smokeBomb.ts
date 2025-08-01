import type { Item } from '../../types';

export const smokeBomb: Item = {
  id: 'smokeBomb',
  name: '烟雾弹 💨',
  description: '大幅提升自己的闪避率，持续2回合。',
  use: (self, state) => {
    // Apply an evasion boost
    state.logEvent(`${self.name} 使用了烟雾弹，身影变得模糊起来。`);
  },
};
