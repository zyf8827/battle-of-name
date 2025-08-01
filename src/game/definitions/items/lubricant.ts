import type { Item } from '../../types';

export const lubricant: Item = {
  id: 'lubricant',
  name: '润滑剂 🧴',
  description: '提升自己的速度和防御，持续3回合。',
  use: (self, state) => {
    state.addStatusEffect(self, {
      id: 'lubricated',
      name: '润滑',
      duration: 3,
      modifiers: {
        speed: 5,
        def: 5,
      },
    });
    state.logEvent(`${self.name} 使用了润滑剂，变得滑不溜秋。`);
  },
};
