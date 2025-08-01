import type { GameEvent } from '../../types';

export const gravityDecrease: GameEvent = {
  id: 'gravityDecrease',
  name: '重力减小 🎈',
  description: '重力减小了，所有人的速度都提升了10点，防御力下降了5点。',
  hooks: {
    onTurnStart: (state) => {
      state.player1.stats.defense = Math.max(0, state.player1.stats.defense - 5);
      state.player2.stats.defense = Math.max(0, state.player2.stats.defense - 5);
      state.logEvent('重力减小！');
    },
  },
};
