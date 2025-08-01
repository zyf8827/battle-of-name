import type { GameEvent } from '../../types';

export const developerAppearance: GameEvent = {
  id: 'developerAppearance',
  name: '游戏开发者出现 👨‍💻',
  description:
    '游戏开发者突然出现在了战场上，他/她/它可能会给你一些帮助，也可能会给你一些惩罚。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('游戏开发者出现了！');
      // Meta-event
    },
  },
};
