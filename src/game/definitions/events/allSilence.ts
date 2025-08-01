import type { GameEvent } from '../../types';

export const allSilence: GameEvent = {
  id: 'allSilence',
  name: '全场沉默 🤫',
  description: '全场陷入了沉默，所有人都无法使用技能和物品，持续1回合。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.player1, {
        id: 'silenced',
        name: '沉默',
        duration: 1,
      });
      state.addStatusEffect(state.player2, {
        id: 'silenced',
        name: '沉默',
        duration: 1,
      });
      state.logEvent('全场沉默！');
    },
  },
};
