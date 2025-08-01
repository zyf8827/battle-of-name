import type { GameEvent } from '../../types';

export const foodDeliveryLate: GameEvent = {
  id: 'foodDeliveryLate',
  name: '外卖迟到 🛵',
  description: '你点的外卖迟到了，你感到非常饥饿，每回合损失5点生命值，持续3回合。',
  hooks: {
    onTurnStart: (state) => {
      // Apply a damage over time effect
      state.logEvent(`外卖迟到！${state.activePlayer.name} 感到非常饥饿！`);
    },
  },
};
