import type { GameEvent } from '../../types';

export const skillSwap: GameEvent = {
  id: 'skillSwap',
  name: '技能交换 🔁',
  description: '你和你的对手的职业技能交换了。',
  hooks: {
    onTurnStart: (state) => {
      // This would be complex to implement
      state.logEvent('技能交换！');
    },
  },
};
