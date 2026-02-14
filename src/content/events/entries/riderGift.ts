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
        apply: '{targetName} 感到一股暖流涌上心头，原来人间真的还有温情 ❤️',
      },
    },
  ],
  texts: {
    trigger: '外卖袋子上贴着一张手写的小纸条，旁边还粘着一颗亮晶晶的薄荷糖 🍭',
  },
};

export default riderGift;
