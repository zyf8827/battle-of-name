import type { GameEvent } from '../../types';

export const versionUpdate: GameEvent = {
  id: 'versionUpdate',
  name: '版本更新 ✅',
  description: '游戏版本更新，修复了一些BUG，所有人的负面状态都被清除了。',
  hooks: {
    onTurnStart: (state) => {
      // Clear all negative status effects for both players
      state.logEvent('版本更新，所有人的负面状态都已被清除！');
    },
  },
};
