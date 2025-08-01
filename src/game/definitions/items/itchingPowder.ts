import type { Item } from '../../types';

export const itchingPowder: Item = {
  id: 'itchingPowder',
  name: '痒痒粉 ✨',
  description: '使敌人在接下来的3回合内，每回合损失5点生命值。',
  use: (self, state) => {
    // Apply a poison-like effect
    state.logEvent(`${self.name} 撒了痒痒粉，${state.opponent.name} 感觉浑身难受。`);
  },
};
