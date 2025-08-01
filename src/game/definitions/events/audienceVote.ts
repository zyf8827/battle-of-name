import type { GameEvent } from '../../types';

export const audienceVote: GameEvent = {
  id: 'audienceVote',
  name: '观众投票 🗳️',
  description: '观众们开始投票，决定下一个回合的走向。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('观众开始投票！');
      // This would be a meta-event
    },
  },
};
