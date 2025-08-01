import type { GameEvent } from '../../types';

export const networkFluctuation: GameEvent = {
  id: 'networkFluctuation',
  name: '网络波动 🌐',
  description: '网络突然卡顿，所有人的速度都下降了10点。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('网络波动，所有人的速度都下降了！');
    },
  },
};
