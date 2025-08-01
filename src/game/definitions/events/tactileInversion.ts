import type { GameEvent } from '../../types';

export const tactileInversion: GameEvent = {
  id: 'tactileInversion',
  name: '触觉颠倒 🖐️',
  description: '你的触觉颠倒了，你感觉不到疼痛，但也感觉不到治疗。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('触觉颠倒！');
      // Immune to damage and healing
    },
  },
};
