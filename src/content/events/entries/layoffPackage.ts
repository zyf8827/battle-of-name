import type { EventPoolEntry } from '../../../engine/types';

const layoffPackage: EventPoolEntry = {
  id: 'event.layoff_package',
  name: '裁员大礼包 🎁',
  weight: 1, // 权重下调，极其罕见
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
      value: [{ type: 'FLAT', value: 300 }],
      tags: ['shield', 'env'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.layoff_wealth',
        source: 'ENV',
        name: '赔偿金入账 💰',
        description: '虽然丢了工作，但手里有钱了，且无所畏惧',
        tags: ['buff', 'env'],
        statBonus: { LUK: 50, STR: 20, VIT: -10 },
        duration: 3,
      },
      textOverrides: {
        apply: '{targetName} 领到了 N+3 赔偿金，突然觉得这工不打也罢！浑身充满了搞钱的斗志 💰',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 被 HR 请进了会议室，喜提“毕业”超级大礼包一份 🎁',
  },
};

export default layoffPackage;
