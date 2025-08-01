import type { Item } from '../../types';

export const smallReport: Item = {
  id: 'smallReport',
  name: '小报告 📝',
  description: '向老师/老板打小报告，使敌人在下回合无法行动。',
  use: (self, state) => {
    // Apply a stun effect
    state.logEvent(`${self.name} 打了小报告，${state.opponent.name} 下回合将无法行动。`);
  },
};
