import type { EventPoolEntry } from '../../../engine/types';

const expiredItem: EventPoolEntry = {
  id: 'event.expired_item',
  name: '零食过期了 🗑️',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.waste_regret',
        source: 'ENV',
        name: '浪费懊悔 😿',
        description: '零食过期只能扔掉',
        tags: ['debuff', 'env'],
        statBonus: { LUK: -2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 看着手里长毛的零食，含泪将其投进了垃圾桶 😿',
      },
    },
    {
      kind: 'LOSE_RANDOM_CONSUMABLE',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '清理背包时，一股奇怪的发酵味从深处飘了出来 🗑️',
  },
};

export default expiredItem;
