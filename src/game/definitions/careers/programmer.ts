
import type { Career } from '../../types';

export const programmer: Career = {
  id: 'programmer',
  name: '格子衫程序员 👨‍💻',
  description: '防御力高，但有一定几率发动“需求又改了”导致自己眩晕一回合。',
  modifiers: {
    def: 10,
  },
  hooks: {
    onTurnStart: (self, state) => {
      if (state.checkProbability('programmer-stun', 0.1)) {
        state.logEvent(
          `${self.name} 突然接到了产品经理的电话，需求又双叒叕改了！`,
        );
        state.addStatusEffect(self, { id: 'stunned', name: '眩晕', duration: 1 });
      }
    },
  },
};
