import type { Item } from '../../types';

export const skeletonKey: Item = {
  id: 'skeletonKey',
  name: '万能钥匙 🔑',
  description: '可以打开任何宝箱，或者在战斗中用来解除对方的一个增益效果。',
  use: (self, state) => {
    // Remove a random buff from the opponent
    state.logEvent(
      `${self.name} 使用了万能钥匙，解除了 ${state.opponent.name} 的一个增益效果。`,
    );
  },
};
