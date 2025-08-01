import type { GameEvent } from '../../types';

export const keyboardFailure: GameEvent = {
  id: 'keyboardFailure',
  name: '键盘失灵 ⌨️',
  description: '你的键盘突然失灵了，本回合无法使用物品。',
  hooks: {
    onTurnStart: (state) => {
      // Prevent item usage for the current player
      state.logEvent(`键盘失灵！${state.activePlayer.name} 本回合无法使用物品！`);
    },
  },
};
