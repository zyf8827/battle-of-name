import type { EventPoolEntry } from '../../../engine/types';

const lotteryWin: EventPoolEntry = {
  id: 'event.lottery_win',
  name: '彩票中奖 🎫',
  weight: 2,
  effects: [
    {
      kind: 'DIRECT_HEAL',
      target: 'SELF',
      value: 50,
      tags: ['heal', 'env'],
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.jackpot_winner',
        source: 'ENV',
        name: '头奖锦鲤 🌟',
        description: '这辈子都没这么红过',
        tags: ['buff', 'env'],
        statBonus: { LUK: 30 },
        duration: 3,
      },
      textOverrides: {
        apply: '{targetName} 发现自己竟然中了头奖！不仅身体倍儿棒，还随手捡到了极品神装 ✨',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 刮开奖符，耀眼的“一等奖”字样让空气都凝固了！这是真正的锦鲤降世！🤑',
  },
};

export default lotteryWin;
