import type { Equipment } from '../../types';

export const laotanSauerkraut: Equipment = {
  id: 'laotanSauerkraut',
  name: '老坛酸菜包 🤢',
  type: 'weapon',
  description: '具有强烈的气味，可以对敌人造成持续伤害。',
  stats: {
    attack: 2,
  },
  hooks: {
    onAfterAttack: (self, target, state) => {
      state.logEvent(`${target.name} 闻到了老坛酸菜的味道，中毒了！`);
      state.addStatusEffect(target, {
        id: 'poisoned',
        name: '中毒',
        duration: 3, // 持续3回合
      });
    },
  },
};
