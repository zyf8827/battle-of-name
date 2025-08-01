import type { Item } from '../../types';

export const reflector: Item = {
  id: 'reflector',
  name: '反光镜 🪞',
  description: '将下一次受到的伤害的50%反弹给攻击者。',
  use: (self, state) => {
    // Apply a damage reflection effect
    state.logEvent(`${self.name} 拿出了一个反光镜。`);
  },
};
