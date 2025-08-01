import type { GameEvent } from '../../types';

export const foundWallet: GameEvent = {
  id: 'foundWallet',
  name: '捡到钱包 👛',
  description: '你在路边捡到了一个钱包，里面有100块钱，可以用来购买道具。',
  hooks: {
    onTurnStart: (state) => {
      // Give the current player some currency
      state.logEvent(`你捡到了一个钱包，获得了100金币！`);
    },
  },
};
