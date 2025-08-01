import type { GameEvent } from '../../types';

export const visualInversion: GameEvent = {
  id: 'visualInversion',
  name: '视觉颠倒 🙃',
  description: '你的视觉颠倒了，你看不到敌人的血条了。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('视觉颠倒！');
      // Hide opponent's HP bar
    },
  },
};
