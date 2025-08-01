import type { GameEvent } from '../../types';

export const mysteriousCode: GameEvent = {
  id: 'mysteriousCode',
  name: '神秘代码 🤔',
  description: '战场上出现了一段神秘的代码，解读后可能会发生意想不到的事情。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('战场上出现了一段神秘的代码...');
      // Implement a random effect
    },
  },
};
