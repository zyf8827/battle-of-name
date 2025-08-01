import type { GameEvent } from '../../types';

export const magneticFieldDisorder: GameEvent = {
  id: 'magneticFieldDisorder',
  name: '磁场紊乱 🧭',
  description: '磁场发生了紊乱，所有人的攻击都有20%的几率打偏。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('磁场紊乱！');
      // Apply an accuracy debuff
    },
  },
};
