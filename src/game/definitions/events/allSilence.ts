import type { GameEvent } from '../../types';

export const allSilence: GameEvent = {
  id: 'allSilence',
  name: '全场沉默 🤫',
  description: '全场陷入了沉默，所有人都无法使用技能和物品，持续1回合。',
  hooks: {
    onTurnStart: (state) => {
      // Apply a silence effect to both players
      state.logEvent('全场沉默！');
    },
  },
};
