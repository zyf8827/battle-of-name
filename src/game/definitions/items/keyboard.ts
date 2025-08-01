import type { Item } from '../../types';

export const keyboard: Item = {
  id: 'keyboard',
  name: '键盘 ⌨️',
  description: '对敌人造成20点伤害，但有10%的几率把自己弄伤，损失5点生命值。',
  use: (self, state) => {
    const damage = 20;
    state.opponent.stats.hp = Math.max(0, state.opponent.stats.hp - damage);
    if (state.checkProbability('keyboard-self-damage', 0.1)) {
      self.stats.hp = Math.max(0, self.stats.hp - 5);
      state.logEvent(
        `${self.name} 用力过猛，键盘敲坏了，对自己造成了 5 点伤害。`,
      );
    }
    state.logEvent(
      `${self.name} 用键盘猛击 ${state.opponent.name}，造成了 ${damage} 点伤害。`,
    );
  },
};
