import type { Item } from '../../types';

export const emoji: Item = {
  id: 'emoji',
  name: '表情包 🤪',
  description: '用一个无法言喻的表情包迷惑敌人，有几率使其混乱，攻击自己。',
  use: (self, state) => {
    if (state.checkProbability('emoji-confusion', 0.25)) {
      // Apply a confusion effect
      state.logEvent(
        `${self.name} 发送了一个神秘的表情包，${state.opponent.name} 混乱了！`,
      );
    }
  },
};
