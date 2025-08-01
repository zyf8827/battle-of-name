import type { GameEvent } from '../../types';

export const olfactoryInversion: GameEvent = {
  id: 'olfactoryInversion',
  name: '嗅觉颠倒 👃',
  description: '你的嗅觉颠倒了，你闻到的所有气味都是反向的。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('嗅觉颠倒！');
      // Cosmetic effect
    },
  },
};
