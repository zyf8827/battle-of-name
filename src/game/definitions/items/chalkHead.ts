import type { Item } from '../../types';

export const chalkHead: Item = {
  id: 'chalkHead',
  name: '粉笔头 ✏️',
  description: '对敌人造成5点伤害，并有几率使其攻击力下降。',
  use: (self, state) => {
    const damage = 5;
    state.opponent.stats.hp = Math.max(0, state.opponent.stats.hp - damage);
    if (state.checkProbability('chalkHead-debuff', 0.3)) {
      state.addStatusEffect(state.opponent, {
        id: 'attack_down',
        name: '攻击下降',
        duration: 2,
        modifiers: {
          atk: 0.8, // 攻击力降低20%
        },
      });
      state.logEvent(
        `${self.name} 扔出了一个粉笔头，对 ${state.opponent.name} 造成了 ${damage} 点伤害，并使其攻击力下降！`,
      );
    } else {
      state.logEvent(
        `${self.name} 扔出了一个粉笔头，对 ${state.opponent.name} 造成了 ${damage} 点伤害。`,
      );
    }
  },
};
