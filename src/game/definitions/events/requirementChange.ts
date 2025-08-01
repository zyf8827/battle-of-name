import type { GameEvent } from '../../types';

export const requirementChange: GameEvent = {
  id: 'requirementChange',
  name: '需求变更 📝',
  description: '客户突然提出了新的需求，所有人的攻击力都下降了5点。',
  hooks: {
    onTurnStart: (state) => {
      state.player1.stats.attack = Math.max(0, state.player1.stats.attack - 5);
      state.player2.stats.attack = Math.max(0, state.player2.stats.attack - 5);
      state.logEvent('需求变更，所有人的攻击力都下降了！');
    },
  },
};