import type { EventPoolEntry } from '../../../engine/types';

const soupSpill: EventPoolEntry = {
  id: 'event.soup_spill',
  name: '外卖汤洒了一身 🍲',
  weight: 12,
  effects: [
    {
      kind: 'DIRECT_DAMAGE',
      target: 'SELF',
      value: 15,
      tags: ['env', 'true_damage'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.soup_burn',
        source: 'ENV',
        name: '烫伤+脏衣服 🤕',
        description: '衣服毁了，皮肤烫了',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -2 },
        duration: 1,
      },
      textOverrides: {
        apply:
          '{targetName} 低头看着身上刚买的浅色衬衫，感觉整个人都要裂开了 🤕',
      },
    },
  ],
  texts: {
    trigger: '外卖盒的塑料盖在热气的冲击下突然崩开，浓稠的汤汁四溅 🍲',
  },
};

export default soupSpill;
