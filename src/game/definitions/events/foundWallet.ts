import { allItems } from '../items';
import type { GameEvent } from '../../types';

export const foundWallet: GameEvent = {
  id: 'foundWallet',
  name: '捡到钱包 👛',
  description: '你在路边捡到了一个钱包，里面有一个随机道具。',
  hooks: {
    onTurnStart: (state) => {
      const randomItem = allItems[Math.floor(state.rng() * allItems.length)];
      state.activePlayer.items.push(randomItem);
      state.logEvent(`你捡到了一个钱包，获得了道具【${randomItem.name}】！`);
    },
  },
};
