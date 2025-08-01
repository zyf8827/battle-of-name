import type { GameEvent } from '../../types';

export const roleSwap: GameEvent = {
  id: 'roleSwap',
  name: '角色互换 🎭',
  description: '你和你的对手的身份互换了，你现在控制着对方的角色。',
  hooks: {
    onTurnStart: (state) => {
      // This would be very complex to implement
      state.logEvent('角色互换！');
    },
  },
};
