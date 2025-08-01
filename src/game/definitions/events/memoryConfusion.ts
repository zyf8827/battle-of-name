import type { GameEvent } from '../../types';

export const memoryConfusion: GameEvent = {
  id: 'memoryConfusion',
  name: '记忆混乱 😵',
  description: '你突然忘记了自己是谁，你的技能和物品都变成了随机的。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('记忆混乱！');
      // Randomize player's items/skills
    },
  },
};
