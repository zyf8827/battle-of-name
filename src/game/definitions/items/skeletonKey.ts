import type { Item } from '../../types';

export const skeletonKey: Item = {
  id: 'skeletonKey',
  name: '万能钥匙 🔑',
  description: '可以打开任何宝箱，或者在战斗中用来解除对方的一个增益效果。',
  use: (self, state) => {
    const targetEffects = state.opponent.statusEffects;
    if (targetEffects.length > 0) {
      // For simplicity, remove a random effect. In a real game, you might define 'buffs' and 'debuffs'.
      const effectToRemoveIndex = Math.floor(state.rng() * targetEffects.length);
      const removedEffect = targetEffects.splice(effectToRemoveIndex, 1)[0];
      state.logEvent(
        `${self.name} 使用了万能钥匙，解除了 ${state.opponent.name} 的 “${removedEffect.name}” 效果。`,
      );
    } else {
      state.logEvent(`${self.name} 使用了万能钥匙，但 ${state.opponent.name} 没有任何增益效果。`);
    }
  },
};
