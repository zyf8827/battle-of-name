import type { Item } from '../../types';

export const chickenSoup: Item = {
  id: 'chickenSoup',
  name: '鸡汤 🥣',
  description: '恢复25点生命值，并提升5点攻击力。',
  use: (self, state) => {
    const healAmount = 25;
    self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
    self.stats.attack += 5;
    state.logEvent(
      `${self.name} 喝了一碗鸡汤，恢复了 ${healAmount} 点生命值，攻击力提升了。`,
    );
  },
};
