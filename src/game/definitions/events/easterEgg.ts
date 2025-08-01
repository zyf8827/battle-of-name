import type { GameEvent } from '../../types';

export const easterEgg: GameEvent = {
  id: 'easterEgg',
  name: '彩蛋 🥚',
  description: '你发现了一个隐藏的彩蛋，可能会获得一些意想不到的奖励。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('你发现了一个彩蛋！');
      // Give a random reward
    },
  },
};
