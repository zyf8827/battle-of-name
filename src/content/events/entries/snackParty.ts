import type { EventPoolEntry } from '../../../engine/types';

const snackParty: EventPoolEntry = {
  id: 'event.snack_party',
  name: '公司零食大放送 🍬',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'buff.snack_happy',
        source: 'ENV',
        name: '零食自由 🍬',
        description: '公司零食柜大放送',
        tags: ['buff', 'env'],
        statBonus: { VIT: 2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 凭借多年抢饭的经验，成功在人群中捞到了最后一包薯片 😋',
      },
    },
    {
      kind: 'GRANT_RANDOM_CONSUMABLE',
      target: 'ALL',
    },
  ],
  texts: {
    trigger: '行政部高喊：“零食柜更新，旧的快过期的随便拿！” 🍬',
  },
};

export default snackParty;
