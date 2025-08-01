import type { Item } from '../../types';

export const bgmPlayer: Item = {
  id: 'bgmPlayer',
  name: 'BGM播放器 🎶',
  description: '播放激昂的背景音乐，提升自己10%的所有属性。',
  use: (self, state) => {
    state.addStatusEffect(self, {
      id: 'bgm_boost',
      name: 'BGM加成',
      duration: 3,
      modifiers: {
        atk: 1.1,
        def: 1.1,
        speed: 1.1,
        critRate: 0.1,
        critDmg: 0.1,
      },
    });
    state.logEvent(`${self.name} 播放了BGM，所有属性都提升了！`);
  },
};
