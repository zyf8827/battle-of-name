import type { EventPoolEntry } from '../../../engine/types';

const yearEndBonus: EventPoolEntry = {
  id: 'event.year_end_bonus',
  name: '年终奖 💰',
  weight: 6,
  effects: [
    {
      kind: 'GRANT_RANDOM_CONSUMABLE',
      target: 'SELF',
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.rich_mood',
        source: 'ENV',
        name: '稍微有钱 🤏',
        description: '虽然不多，但是真钱',
        tags: ['buff', 'env'],
        statBonus: { LUK: 3, STR: 2 },
        duration: 2,
      },
    },
  ],
  texts: {
    trigger: '{actorName} 的年终奖终于到账了！虽然扣完税没剩多少 💸。',
  },
};

export default yearEndBonus;
