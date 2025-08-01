import type { Item } from '../../types';

export const lightnessAgent: Item = {
  id: 'lightnessAgent',
  name: '轻身剂 🕊️',
  description: '提升15点速度，持续3回合。',
  use: (self, state) => {
    state.addStatusEffect(self, {
      id: 'lightness_boost',
      name: '轻身',
      duration: 3,
      modifiers: {
        speed: 15,
      },
    });
    state.logEvent(`${self.name} 使用了轻身剂，速度提升了！`);
  },
};
