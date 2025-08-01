import type { Item } from '../../types';

export const dimensionStrike: Item = {
  id: 'dimensionStrike',
  name: '降维打击 💥',
  description: '对敌人造成毁灭性的打击，但使用者也会受到一半的反噬伤害。',
  use: (self, state) => {
    const damage = Math.floor(state.opponent.stats.hp * 0.5);
    state.opponent.stats.hp = Math.max(0, state.opponent.stats.hp - damage);
    self.stats.hp = Math.max(0, self.stats.hp - Math.floor(damage / 2));
    state.logEvent(
      `${self.name} 发动了降维打击，对 ${state.opponent.name} 造成了 ${damage} 点伤害，自己也受到了反噬。`,
    );
  },
};
