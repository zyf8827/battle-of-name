import type { Item } from '../../types';

export const cloudBackup: Item = {
  id: 'cloudBackup',
  name: '云盘备份 💾',
  description: '如果在本回合被击败，有50%的几率以1点生命值复活。',
  use: (self, state) => {
    // Apply a revival effect
    state.logEvent(`${self.name} 进行了云盘备份，获得了复活的机会。`);
  },
};
