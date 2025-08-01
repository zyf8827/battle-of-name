import type { GameEvent } from '../../types';

export const gustatoryInversion: GameEvent = {
  id: 'gustatoryInversion',
  name: '味觉颠倒 👅',
  description: '你的味觉颠倒了，你吃的药都变成了毒药，毒药都变成了药。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('味觉颠倒！');
      // Invert healing and poison effects
    },
  },
};
