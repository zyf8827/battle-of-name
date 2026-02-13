import type { EventPoolEntry } from '../../../engine/types';

const bigPie: EventPoolEntry = {
  id: 'event.big_pie',
  name: '画的大饼 🥞',
  weight: 12,
  effects: [
    {
      kind: 'SHIELD',
      target: 'SELF',
      value: [{ type: 'FLAT', value: 30 }],
      tags: ['shield', 'env'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.fake_hope',
        source: 'ENV',
        name: '未来期权 📈',
        description: '虽然现在没钱，但未来可期',
        tags: ['buff', 'env'],
        duration: 2,
        texts: {
          remove: '{targetName} 发现大饼其实不能吃，护盾消失 💨。'
        }
      },
    },
  ],
  texts: {
    trigger: '老板给 {actorName} 画了一个巨大的饼 🤥。',
  },

};

export default bigPie;
