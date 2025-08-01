import type { GameEvent } from '../../types';

export const ruleChange: GameEvent = {
  id: 'ruleChange',
  name: '规则改变 📜',
  description: '游戏规则发生了改变，例如，现在攻击力高的一方会受到双倍伤害。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('游戏规则发生了改变！');
      // Implement a random rule change
    },
  },
};
