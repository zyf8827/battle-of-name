import type { GameEvent } from '../../types';

export const networkAcceleration: GameEvent = {
  id: 'networkAcceleration',
  name: '网络加速 🚀',
  description: '网络环境突然变好，所有人的速度都提升了10点。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('网络加速，所有人的速度都提升了！');
    },
  },
};
