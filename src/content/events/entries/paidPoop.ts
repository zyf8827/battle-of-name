import type { EventPoolEntry } from '../../../engine/types';

const paidPoop: EventPoolEntry = {
  id: 'event.paid_poop',
  name: '带薪拉屎 🚽',
  weight: 12,
  effects: [
    {
      kind: 'DIRECT_HEAL',
      target: 'SELF',
      value: 35,
      tags: ['heal', 'env'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.sanctuary',
        source: 'ENV',
        name: '厕所庇护 🛡️',
        description: '这才是真正的自由',
        tags: ['buff', 'env'],
        statBonus: { VIT: 5, LUK: 2 },
        duration: 2,
      },
    },
  ],
  texts: {
    trigger: '{actorName} 躲进了厕所隔间，在这一平米的空间里找到了人生的真谛 😌。',
  },
};

export default paidPoop;
