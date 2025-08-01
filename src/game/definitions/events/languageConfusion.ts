import type { GameEvent } from '../../types';

export const languageConfusion: GameEvent = {
  id: 'languageConfusion',
  name: '语言混乱 🗣️',
  description: '你和你的对手的语言变得混乱，你们无法理解对方在说什么。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('语言混乱！');
      // This would be a cosmetic effect
    },
  },
};
