import type { EventPoolEntry } from '../../../engine/types';

const riderGift: EventPoolEntry = {
  id: 'event.rider_gift',
  name: '外卖骑手送礼点赞 🚲',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.rider_warmth',
        source: 'ENV',
        name: '人间温暖 ❤️',
        description: '骑手送的糖果',
        tags: ['buff', 'env'],
        statBonus: { VIT: 2, LUK: 2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 收到外卖小哥的小礼物，暖化了 ❤️',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 点外卖，骑手小哥送了个小糖：祝您今天开心 🚲',
  },
};

export default riderGift;
