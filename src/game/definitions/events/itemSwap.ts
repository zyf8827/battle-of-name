import type { GameEvent } from '../../types';

export const itemSwap: GameEvent = {
  id: 'itemSwap',
  name: '物品交换 🤝',
  description: '你和你的对手的物品栏交换了。',
  hooks: {
    onTurnStart: (state) => {
      const tempItems = state.player1.items;
      state.player1.items = state.player2.items;
      state.player2.items = tempItems;
      state.logEvent('物品交换！');
    },
  },
};
