import type { GameEvent } from '../../types';

export const networkAcceleration: GameEvent = {
  id: 'networkAcceleration',
  name: '网络加速 🚀',
  description: '网络环境突然变好，所有人的速度都提升了10点。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.player1, {
        id: 'network_acceleration_buff',
        name: '网络加速',
        duration: 1,
        modifiers: {
          speed: 10,
        },
      });
      state.addStatusEffect(state.player2, {
        id: 'network_acceleration_buff',
        name: '网络加速',
        duration: 1,
        modifiers: {
          speed: 10,
        },
      });
      state.logEvent('网络加速，所有人的速度都提升了！');
    },
  },
};
