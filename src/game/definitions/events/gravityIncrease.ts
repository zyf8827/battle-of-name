import type { GameEvent } from '../../types';

export const gravityIncrease: GameEvent = {
  id: 'gravityIncrease',
  name: '重力增加 🏋️',
  description: '重力增加了，所有人的速度都下降了10点，防御力提升了5点。',
  hooks: {
    onTurnStart: (state) => {
      state.player1.stats.defense += 5;
      state.player2.stats.defense += 5;
      state.logEvent('重力增加！');
    },
  },
};
