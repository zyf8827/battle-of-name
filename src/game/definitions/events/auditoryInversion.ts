import type { GameEvent } from '../../types';

export const auditoryInversion: GameEvent = {
  id: 'auditoryInversion',
  name: '听觉颠倒 👂',
  description: '你的听觉颠倒了，你听到的所有声音都是反向的。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('听觉颠倒！');
      // Cosmetic effect
    },
  },
};
