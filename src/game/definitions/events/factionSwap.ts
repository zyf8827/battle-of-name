import type { GameEvent } from '../../types';

export const factionSwap: GameEvent = {
  id: 'factionSwap',
  name: '阵营交换 👥',
  description: '你和你的对手的阵营交换了，现在你要为对方的胜利而战。',
  hooks: {
    onTurnStart: (state) => {
      // This would be very complex to implement
      state.logEvent('阵营交换！');
    },
  },
};
