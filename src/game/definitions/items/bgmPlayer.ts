import type { Item } from '../../types';

export const bgmPlayer: Item = {
  id: 'bgmPlayer',
  name: 'BGM播放器 🎶',
  description: '播放激昂的背景音乐，提升自己10%的所有属性。',
  use: (self, state) => {
    self.stats.attack = Math.floor(self.stats.attack * 1.1);
    self.stats.defense = Math.floor(self.stats.defense * 1.1);
    state.logEvent(`${self.name} 播放了BGM，所有属性都提升了！`);
  },
};
