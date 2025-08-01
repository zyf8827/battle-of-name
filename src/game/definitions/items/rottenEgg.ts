import type { Item } from '../../types';

export const rottenEgg: Item = {
  id: 'rottenEgg',
  name: '臭鸡蛋 🥚',
  description: '对敌人造成10点伤害，并有几率使其恶心，降低其攻击力。',
  use: (self, state) => {
    const damage = 10;
    state.opponent.stats.hp = Math.max(0, state.opponent.stats.hp - damage);
    if (state.checkProbability('rottenEgg-debuff', 0.3)) {
      state.opponent.stats.attack = Math.max(0, state.opponent.stats.attack - 3);
      state.logEvent(
        `${self.name} 扔出了一颗臭鸡蛋，对 ${state.opponent.name} 造成了 ${damage} 点伤害，并使其攻击力下降！`,
      );
    } else {
      state.logEvent(
        `${self.name} 扔出了一颗臭鸡蛋，对 ${state.opponent.name} 造成了 ${damage} 点伤害。`,
      );
    }
  },
};
