import type { Career } from '../../types';

export const contrarian: Career = {
  id: 'contrarian',
  name: '杠精 🗣️',
  description: '“我不要你觉得，我要我觉得。” 攻击力很高，但防御力很低。',
  modifiers: {
    atk: 10,
    def: -10,
  },
  hooks: {
    onBeforeAttack: (self, target, state) => {
      if (state.checkProbability('contrarian-crit', 0.25)) {
        state.logEvent(`${self.name} 开始抬杠，本次攻击必定暴击！`);
        // A bit of a hack to guarantee a crit
        state.activePlayer.stats.critRate += 100;
      }
    },
    onAfterAttack: (self, target, state) => {
      // Reset crit rate
      state.activePlayer.stats.critRate -= 100;
    },
  },
};
