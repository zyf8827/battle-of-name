import type { Item } from '../../types';

export const magnifyingGlass: Item = {
  id: 'magnifyingGlass',
  name: '放大镜 🔎',
  description: '查看敌人的详细属性和状态。',
  use: (self, state) => {
    // Display opponent's stats
    state.logEvent(
      `${self.name} 使用了放大镜，看清了 ${state.opponent.name} 的底细。`,
    );
  },
};
