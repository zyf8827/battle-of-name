import type { GameEvent } from '../../types';

export const suddenPowerOutage: GameEvent = {
  id: 'suddenPowerOutage',
  name: '突然停电 💡',
  description: '突然停电，所有人都无法行动一回合。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.player1, {
        id: 'stunned',
        name: '停电眩晕',
        duration: 1,
      });
      state.addStatusEffect(state.player2, {
        id: 'stunned',
        name: '停电眩晕',
        duration: 1,
      });
      state.logEvent('突然停电！所有人都无法行动！');
    },
  },
};