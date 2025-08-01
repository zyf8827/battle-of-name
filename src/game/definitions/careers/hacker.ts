import type { Career } from '../../types';

export const hacker: Career = {
  id: 'hacker',
  name: '黑客 👾',
  description: '“你的防火墙不堪一击。” 能够找到对手的弱点，降低其防御。',
  modifiers: {
    atk: 8,
  },
  hooks: {
    onBeforeAttack: (self, target, state) => {
      if (state.checkProbability('hacker-debuff', 0.3)) {
        target.stats.def = Math.max(0, target.stats.def - 3);
        state.logEvent(
          `${self.name} 找到了 ${target.name} 的一个漏洞，使其防御力下降了！`,
        );
      }
    },
  },
};
