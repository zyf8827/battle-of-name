import type { Equipment } from '../../types';

export const rainbowFartLauncher: Equipment = {
  id: 'rainbowFartLauncher',
  name: '彩虹屁发射器 🌈',
  type: 'weapon',
  description: '用甜言蜜语攻击敌人，有几率让敌人心情愉悦而降低攻击力。',
  stats: {
    attack: 5,
  },
  hooks: {
    onAfterAttack: (self, target, state) => {
      if (state.checkProbability('rainbowFartLauncher-debuff', 0.2)) {
        target.stats.attack = Math.max(0, target.stats.attack - 2);
        state.logEvent(
          `${self.name} 发射了彩虹屁，${target.name} 的攻击力下降了！`,
        );
      }
    },
  },
};
