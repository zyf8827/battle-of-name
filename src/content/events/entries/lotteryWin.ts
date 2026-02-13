import type { EventPoolEntry } from '../../../engine/types';

const lotteryWin: EventPoolEntry = {
  id: 'event.lottery_win',
  name: '彩票中奖 🎫',
  weight: 6,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.lucky_illusion',
        source: 'ENV',
        name: '欧皇附体 🌟',
        description: '虽然只中了两块钱',
        tags: ['buff', 'env'],
        statBonus: { LUK: 4 },
        duration: 2,
      },
    },
  ],
  texts: {
    trigger: '{actorName} 刮刮乐中了两块钱！这就是天选之子吗？🤑',
  },

};

export default lotteryWin;
