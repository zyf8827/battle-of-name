import type { GameEvent } from '../../types';

export const weatherChange: GameEvent = {
  id: 'weatherChange',
  name: '天气变化 ☀️',
  description: '天气发生了变化，可能会下雨、刮风、或者出太阳，对战斗产生不同的影响。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('天气发生了变化！');
      // Implement random weather effects
    },
  },
};
