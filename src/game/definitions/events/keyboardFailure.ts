import type { GameEvent } from '../../types';

export const keyboardFailure: GameEvent = {
  id: 'keyboardFailure',
  name: '键盘失灵 ⌨️',
  description: '你的键盘突然失灵了，本回合无法使用物品。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.activePlayer, {
        id: 'item_disabled',
        name: '物品禁用',
        duration: 1,
      });
      state.logEvent(`键盘失灵！${state.activePlayer.name} 本回合无法使用物品！`);
    },
  },
};
