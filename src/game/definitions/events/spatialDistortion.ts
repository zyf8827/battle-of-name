import type { GameEvent } from '../../types';

export const spatialDistortion: GameEvent = {
  id: 'spatialDistortion',
  name: '空间扭曲 🌀',
  description: '空间发生了扭曲，你和你的对手的位置随机互换。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('空间扭曲！');
      // Swap player positions
    },
  },
};
