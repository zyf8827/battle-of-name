import type { Item } from '../../types';

export const chickenBlood: Item = {
  id: 'chickenBlood',
  name: '鸡血 💉',
  description: '大幅提升攻击力，但会损失10点生命值。',
  use: (self, state) => {
    self.stats.attack += 15;
    self.stats.hp = Math.max(0, self.stats.hp - 10);
    state.logEvent(
      `${self.name} 给自己打了一针鸡血，攻击力大幅提升，但损失了10点生命值。`,
    );
  },
};
