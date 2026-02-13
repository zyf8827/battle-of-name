import type { EventPoolEntry } from '../../../engine/types';

const trafficJam: EventPoolEntry = {
  id: 'event.traffic_jam',
  name: '全城堵车 🚗',
  weight: 8,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'debuff.traffic_jam',
        source: 'ENV',
        name: '路怒症 🤬',
        description: '全城交通瘫痪，心情极度烦躁',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 被堵在路上动弹不得！ 🛑',
      },
    },
  ],
  texts: {
    trigger: '早高峰来袭！整个城市变成了一个巨大的停车场 🅿️。',
  },
};

export default trafficJam;
