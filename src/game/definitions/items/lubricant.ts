import type { Item } from '../../types';

export const lubricant: Item = {
  id: 'lubricant',
  name: '润滑剂 🧴',
  description: '提升自己的闪避率，持续3回合。',
  use: (self, state) => {
    // Apply an evasion boost
    state.logEvent(`${self.name} 使用了润滑剂，变得滑不溜秋。`);
  },
};
