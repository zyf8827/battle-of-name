import type { Item } from '../../types';

export const spicyStrip: Item = {
  id: 'spicyStrip',
  name: '辣条 🌶️',
  description: '恢复少量生命值，但可能会因为太辣而降低防御力。',
  use: (self, state) => {
    const healAmount = 20;
    self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
    self.stats.defense = Math.max(0, self.stats.defense - 1);
    state.logEvent(
      `${self.name} 吃了一根辣条，恢复了 ${healAmount} 点生命值，但防御力下降了。`,
    );
  },
};
