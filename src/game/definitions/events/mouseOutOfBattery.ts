import type { GameEvent } from '../../types';

export const mouseOutOfBattery: GameEvent = {
  id: 'mouseOutOfBattery',
  name: '鼠标没电 🖱️',
  description: '你的鼠标没电了，本回合无法进行攻击。',
  hooks: {
    onTurnStart: (state) => {
      // Prevent attacking for the current player
      state.logEvent(`鼠标没电！${state.activePlayer.name} 本回合无法进行攻击！`);
    },
  },
};
