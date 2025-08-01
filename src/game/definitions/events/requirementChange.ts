import type { GameEvent } from '../../types';

export const requirementChange: GameEvent = {
  id: 'requirementChange',
  name: '需求变更 📝',
  description: '客户突然提出了新的需求，所有人的攻击力都下降了5点。',
  hooks: {
    onTurnStart: (battle) => {
      battle.player1.attack = Math.max(0, battle.player1.attack - 5);
      battle.player2.attack = Math.max(0, battle.player2.attack - 5);
      battle.log.push('需求变更，所有人的攻击力都下降了！');
    },
  },
};
