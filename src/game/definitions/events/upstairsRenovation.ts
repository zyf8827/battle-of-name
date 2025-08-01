import type { GameEvent } from '../../types';

export const upstairsRenovation: GameEvent = {
  id: 'upstairsRenovation',
  name: '楼上装修 🏗️',
  description: '楼上在装修，噪音让你无法集中注意力，所有行动都有20%的几率失败。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.player1, {
        id: 'action_failure',
        name: '行动失败',
        duration: 1,
      });
      state.addStatusEffect(state.player2, {
        id: 'action_failure',
        name: '行动失败',
        duration: 1,
      });
      state.logEvent('楼上在装修，噪音让你无法集中注意力！');
    },
  },
};
