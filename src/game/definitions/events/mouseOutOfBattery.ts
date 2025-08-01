import type { GameEvent } from '../../types';

export const mouseOutOfBattery: GameEvent = {
  id: 'mouseOutOfBattery',
  name: '鼠标没电 🖱️',
  description: '你的鼠标没电了，本回合无法进行攻击。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.activePlayer, {
        id: 'attack_disabled',
        name: '攻击禁用',
        duration: 1,
      });
      state.logEvent(`鼠标没电！${state.activePlayer.name} 本回合无法进行攻击！`);
    },
  },
};
