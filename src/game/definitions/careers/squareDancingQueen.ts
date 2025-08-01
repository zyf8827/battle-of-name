import type { Career } from '../../types';

export const squareDancingQueen: Career = {
  id: 'squareDancingQueen',
  name: '广场舞大妈 💃',
  description: '身法灵活，善于闪避，还能在战斗中恢复体力。',
  modifiers: {
    def: 5,
  },
  hooks: {
    onTurnEnd: (self, state) => {
      if (state.checkProbability('squareDancingQueen-heal', 0.25)) {
        const healAmount = Math.floor(self.stats.maxHp * 0.05);
        self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
        state.logEvent(
          `${self.name} 跳了一段广场舞，恢复了 ${healAmount} 点生命值。`,
        );
      }
    },
  },
};
