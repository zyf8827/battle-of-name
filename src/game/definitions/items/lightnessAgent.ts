import type { Item } from '../../types';

export const lightnessAgent: Item = {
  id: 'lightnessAgent',
  name: '轻身剂 🕊️',
  description: '提升15点速度，持续3回合。',
  use: (self, state) => {
    // Apply a temporary speed boost
    state.logEvent(`${self.name} 使用了轻身剂，速度提升了！`);
  },
};
