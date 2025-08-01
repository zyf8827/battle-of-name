import type { GameEvent } from '../../types';

export const gameSpeedUp: GameEvent = {
  id: 'gameSpeedUp',
  name: '游戏加速 ⏩',
  description: '游戏速度加快了，所有人的速度都提升了50%。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.player1, {
        id: 'game_speed_up',
        name: '游戏加速',
        duration: 1,
        modifiers: {
          speed: 1.5,
        },
      });
      state.addStatusEffect(state.player2, {
        id: 'game_speed_up',
        name: '游戏加速',
        duration: 1,
        modifiers: {
          speed: 1.5,
        },
      });
      state.logEvent('游戏加速！');
    },
  },
};
