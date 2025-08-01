import type { Item } from '../../types';

export const smokeBomb: Item = {
  id: 'smokeBomb',
  name: '烟雾弹 💨',
  description: '大幅提升自己的速度和防御，持续2回合。',
  use: (self, state) => {
    state.addStatusEffect(self, {
      id: 'smoke_bomb_effect',
      name: '烟雾弹',
      duration: 2,
      modifiers: {
        speed: 10,
        def: 10,
      },
    });
    state.logEvent(`${self.name} 使用了烟雾弹，身影变得模糊起来。`);
  },
};
