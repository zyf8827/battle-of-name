import type { Item } from '../../types';

export const bandAid: Item = {
  id: 'bandAid',
  name: '创可贴 🩹',
  description: '恢复少量生命值，并在接下来的3回合内每回合恢复5点生命值。',
  use: (self, state) => {
    const healAmount = 10;
    self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
    // Apply a regeneration effect
    state.logEvent(
      `${self.name} 使用了创可贴，恢复了 ${healAmount} 点生命值，并开始持续恢复。`,
    );
  },
};
