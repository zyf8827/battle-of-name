import type { Item } from '../../types';

export const beautyFilter: Item = {
  id: 'beautyFilter',
  name: '美颜滤镜 🤳',
  description: '提升自己的魅力，使敌人有20%的几率被迷住，无法行动。',
  use: (self, state) => {
    if (state.checkProbability('beautyFilter-charm', 0.2)) {
      state.addStatusEffect(state.opponent, {
        id: 'charmed',
        name: '魅惑',
        duration: 1,
        hooks: {
          onBeforeAttack: (char, target, battleState) => {
            battleState.logEvent(`${char.name} 被魅惑了，无法行动！`);
            return true; // Cancel attack
          },
        },
      });
      state.logEvent(`${self.name} 打开了美颜滤镜，${state.opponent.name} 被迷住了！`);
    } else {
      state.logEvent(`${self.name} 打开了美颜滤镜，变得更加动人了。`);
    }
  },
};
