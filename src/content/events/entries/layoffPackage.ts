import type { EventPoolEntry } from '../../../engine/types';

const layoffPackage: EventPoolEntry = {
  id: 'event.layoff_package',
  name: '裁员大礼包 🎁',
  weight: 2, // 极低权重，属于改变局势的罕见事件
  effects: [
    {
      kind: 'LOSE_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
    {
      kind: 'LOSE_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
    {
      kind: 'LOSE_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
    {
      kind: 'SHIELD',
      target: 'SELF',
      value: [{ type: 'FLAT', value: 100 }],
      tags: ['shield', 'env'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.layoff_wealth',
        source: 'ENV',
        name: '赔偿金入账 💰',
        description: '虽然丢了工作，但手里有钱了',
        tags: ['buff', 'env'],
        statBonus: { LUK: 10 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 领到了 N+3 赔偿金，突然觉得这工不打也罢 💰',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 被 HR 请进了会议室，喜提“毕业”礼包一份 🎁',
  },
};

export default layoffPackage;
