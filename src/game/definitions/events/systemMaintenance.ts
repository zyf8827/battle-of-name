import type { GameEvent } from '../../types';

export const systemMaintenance: GameEvent = {
  id: 'systemMaintenance',
  name: '系统维护 🛠️',
  description: '游戏进行中，突然进行系统维护，所有人的生命值都恢复一定百分比。',
  hooks: {
    onTurnStart: (state) => {
      const healPercentage = state.checkProbability('systemMaintenance-heal', 0.5) ? 0.2 : 0.3; // 20% or 30%
      const healAmount1 = Math.floor(state.player1.stats.maxHp * healPercentage);
      const healAmount2 = Math.floor(state.player2.stats.maxHp * healPercentage);

      state.player1.stats.hp = Math.min(state.player1.stats.maxHp, state.player1.stats.hp + healAmount1);
      state.player2.stats.hp = Math.min(state.player2.stats.maxHp, state.player2.stats.hp + healAmount2);

      state.logEvent(`系统维护，所有人的生命值都已恢复 ${Math.floor(healPercentage * 100)}%！`);
    },
  },
};