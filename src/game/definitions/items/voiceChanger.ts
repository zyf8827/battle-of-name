import type { Item } from '../../types';

export const voiceChanger: Item = {
  id: 'voiceChanger',
  name: '变声器 🗣️',
  description: '用奇怪的声音迷惑敌人，使其下一次攻击有50%的几率失败。',
  use: (self, state) => {
    // Apply a miss chance effect
    state.logEvent(`${self.name} 使用了变声器，发出了奇怪的声音。`);
  },
};
