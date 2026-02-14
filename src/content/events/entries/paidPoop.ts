import type { EventPoolEntry } from '../../../engine/types';

const paidPoop: EventPoolEntry = {
  id: 'event.paid_poop',
  name: '带薪拉屎 🚽',
  weight: 14,
  effects: [
    {
      kind: 'DIRECT_HEAL',
      target: 'SELF',
      value: 20,
      tags: ['heal', 'env'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.sanctuary',
        source: 'ENV',
        name: '厕所庇护 🛡️',
        description: '最放松的时刻',
        tags: ['buff', 'env'],
        statBonus: { VIT: 2 },
        duration: 2,
      },
    },
  ],
  texts: {
    trigger: '{actorName} 躲进了厕所隔间，享受带薪时光 😌。',
  },
};

export default paidPoop;
