import type { GameEvent } from '../../types';

export const gravityDecrease: GameEvent = {
  id: 'gravityDecrease',
  name: '重力减小 🎈',
  description: '重力减小了，所有人的速度都提升了10点，防御力下降了5点。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.player1, {
        id: 'gravity_decrease_effect',
        name: '重力减小',
        duration: 1,
        modifiers: {
          speed: 10,
          def: -5,
        },
      });
      state.addStatusEffect(state.player2, {
        id: 'gravity_decrease_effect',
        name: '重力减小',
        duration: 1,
        modifiers: {
          speed: 10,
          def: -5,
        },
      });
      state.logEvent('重力减小！');
    },
  },
};
