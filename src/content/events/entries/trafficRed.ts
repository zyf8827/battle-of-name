import type { EventPoolEntry } from '../../../engine/types';

const trafficRed: EventPoolEntry = {
  id: 'event.traffic_red',
  name: '全城红绿灯全红 🚦',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'debuff.traffic_jam_misery',
        source: 'ENV',
        name: '全城拥堵 🚗',
        description: '所有路口都是红灯',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 被困在十字路口中心，体验着什么是现实版的“寸步难行” 🛑',
      },
    },
  ],
  texts: {
    trigger: '交通灯仿佛集体陷入了某种固执，所有路口都亮起了那抹不祥的红色 🚦',
  },
};

export default trafficRed;
