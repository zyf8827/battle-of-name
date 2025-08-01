import type { GameEvent } from '../../types';

export const foodDeliveryLate: GameEvent = {
  id: 'foodDeliveryLate',
  name: '外卖迟到 🛵',
  description: '你点的外卖迟到了，你感到非常饥饿，每回合损失5点生命值，持续3回合。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.activePlayer, {
        id: 'hungry',
        name: '饥饿',
        duration: 3,
        hooks: {
          onTurnEnd: (character, battleState) => {
            const damage = 5;
            character.stats.hp = Math.max(0, character.stats.hp - damage);
            battleState.logEvent(`${character.name} 感到饥饿，损失了 ${damage} 点生命值！`);
          },
        },
      });
      state.logEvent(`外卖迟到！${state.activePlayer.name} 感到非常饥饿！`);
    },
  },
};
