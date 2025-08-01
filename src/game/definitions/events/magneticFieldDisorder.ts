import type { GameEvent } from '../../types';

export const magneticFieldDisorder: GameEvent = {
  id: 'magneticFieldDisorder',
  name: '磁场紊乱 🧭',
  description: '磁场发生了紊乱，所有人的攻击都有20%的几率打偏。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.player1, {
        id: 'magnetic_field_debuff',
        name: '磁场紊乱',
        duration: 1,
        hooks: {
          onBeforeAttack: (self, target, battleState) => {
            if (battleState.checkProbability('magneticField-miss', 0.2)) {
              battleState.logEvent(`${self.name} 的攻击因为磁场紊乱而打偏了！`);
              return true; // Cancel attack
            }
          },
        },
      });
      state.addStatusEffect(state.player2, {
        id: 'magnetic_field_debuff',
        name: '磁场紊乱',
        duration: 1,
        hooks: {
          onBeforeAttack: (self, target, battleState) => {
            if (battleState.checkProbability('magneticField-miss', 0.2)) {
              battleState.logEvent(`${self.name} 的攻击因为磁场紊乱而打偏了！`);
              return true; // Cancel attack
            }
          },
        },
      });
      state.logEvent('磁场紊乱！');
    },
  },
};
