import type { GameEvent } from '../../types';

export const systemMaintenance: GameEvent = {
  id: 'systemMaintenance',
  name: '系统维护 🛠️',
  description: '游戏进行中，突然进行系统维护，所有人的生命值都恢复到满。',
  hooks: {
    onTurnStart: (state) => {
      state.player1.stats.hp = state.player1.stats.maxHp;
      state.player2.stats.hp = state.player2.stats.maxHp;
      state.logEvent('系统维护，所有人的生命值都已恢复！');
    },
  },
};
