import type { Career } from '../../types';

export const fortuneTeller: Career = {
  id: 'fortuneTeller',
  name: '算命先生 🔮',
  description: '“我观你印堂发黑...” 擅长操控运气。',
  modifiers: {
    critRate: 0.1,
    critDmg: 0.2,
  },
  hooks: {
    onTurnStart: (self, state) => {
      if (state.checkProbability('fortune-debuff', 0.2)) {
        state.opponent.stats.critRate -= 0.05;
        state.logEvent(
          `${self.name} 算出 ${state.opponent.name} 今天运气不佳，暴击率下降了。`,
        );
      }
    },
  },
};
