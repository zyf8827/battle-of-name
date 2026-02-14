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
        apply: '{targetName} 摸着咕咕叫的肚子，在五元代金券中获得了一丝精神安慰 🍀',
      },
    },
    {
      kind: 'GRANT_RANDOM_CONSUMABLE',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '外卖订单的配送时间已经变成了红色，系统自动弹出一条补偿消息 🎫',
  },
};

export default refundCoupon;
