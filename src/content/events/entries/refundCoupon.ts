import type { EventPoolEntry } from '../../../engine/types';

const refundCoupon: EventPoolEntry = {
  id: 'event.refund_coupon',
  name: '外卖超时赔了券 🎫',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.refund_lucky',
        source: 'ENV',
        name: '因祸得福 🍀',
        description: '超时赔偿券',
        tags: ['buff', 'env'],
        statBonus: { VIT: 2, LUK: 2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 的外卖超时了，收到优惠券 🍀',
      },
    },
    {
      kind: 'GRANT_RANDOM_CONSUMABLE',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '{actorName} 点外卖超时，平台赔付了优惠券 🎫',
  },
};

export default refundCoupon;
