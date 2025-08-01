import type { Item } from '../../types';

export const beautyFilter: Item = {
  id: 'beautyFilter',
  name: '美颜滤镜 🤳',
  description: '提升自己的魅力，使敌人有20%的几率被迷住，无法行动。',
  use: (self, state) => {
    // Apply a charm effect
    state.logEvent(`${self.name} 打开了美颜滤镜，变得更加动人了。`);
  },
};
