import type { GameEvent } from '../../types';

export const fourthWallBreak: GameEvent = {
  id: 'fourthWallBreak',
  name: '第四面墙被打破 🧱',
  description: '你意识到了自己只是一个游戏角色，你获得了与游戏开发者对话的能力。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('第四面墙被打破了！');
      // Meta-event
    },
  },
};
