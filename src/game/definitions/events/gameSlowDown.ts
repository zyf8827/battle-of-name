import type { GameEvent } from '../../types';

export const gameSlowDown: GameEvent = {
  id: 'gameSlowDown',
  name: '游戏减速 ⏪',
  description: '游戏速度减慢了，所有人的速度都降低了50%。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('游戏减速！');
    },
  },
};
