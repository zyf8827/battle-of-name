import type { GameEvent } from '../../types';

export const gameSpeedUp: GameEvent = {
  id: 'gameSpeedUp',
  name: '游戏加速 ⏩',
  description: '游戏速度加快了，所有人的速度都提升了50%。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('游戏加速！');
    },
  },
};
