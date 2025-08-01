import type { GameEvent } from '../../types';

export const gravityIncrease: GameEvent = {
  id: 'gravityIncrease',
  name: '重力增加 🏋️',
  description: '重力增加了，所有人的速度都下降了10点，防御力提升了5点。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.player1, {
        id: 'gravity_increase_effect',
        name: '重力增加',
        duration: 1,
        modifiers: {
          speed: -10,
          def: 5,
        },
      });
      state.addStatusEffect(state.player2, {
        id: 'gravity_increase_effect',
        name: '重力增加',
        duration: 1,
        modifiers: {
          speed: -10,
          def: 5,
        },
      });
      state.logEvent('重力增加！');
    },
  },
};
