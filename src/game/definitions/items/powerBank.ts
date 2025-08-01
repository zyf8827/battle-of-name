import type { Item } from '../../types';

export const powerBank: Item = {
  id: 'powerBank',
  name: '充电宝 🔋',
  description: '恢复自己或队友20%的能量值（如果游戏有能量系统）。',
  use: (self, state) => {
    state.logEvent(`${self.name} 使用了充电宝，感觉充满了电。`);
  },
};
