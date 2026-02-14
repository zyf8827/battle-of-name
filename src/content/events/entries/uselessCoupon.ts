import type { EventPoolEntry } from '../../../engine/types';

const uselessCoupon: EventPoolEntry = {
  id: 'event.useless_coupon',
  name: '劳斯莱斯优惠券 🎟️',
  weight: 12,
  effects: [
    {
      kind: 'SHIELD',
      target: 'SELF',
      value: [{ type: 'FLAT', value: 5 }],
      tags: ['shield', 'env'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.mental_comfort',
        source: 'ENV',
        name: '自我安慰 🧘',
        description: '聊胜于无',
        tags: ['buff', 'env'],
        statBonus: { LUK: 1 },
        duration: 2,
      },
    },
  ],
  texts: {
    trigger: '{actorName} 抢到了一张“劳斯莱斯立减1000元”的优惠券 🤏。',
  },
};

export default uselessCoupon;
