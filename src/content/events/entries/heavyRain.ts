import type { EventPoolEntry } from '../../../engine/types';

const heavyRain: EventPoolEntry = {
  id: 'event.heavy_rain',
  name: '暴雨没带伞 🌧️',
  weight: 8,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'debuff.wet',
        source: 'ENV',
        name: '落汤鸡 🐔',
        description: '浑身湿透，心情极差',
        tags: ['debuff', 'env'],
        statBonus: { LUK: -2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 顶着公文包在雨中狂奔，鞋子里传来了咕唧咕唧的水声 💦',
      },
    },
  ],
  texts: {
    trigger: '乌云密布，毫无预兆的倾盆大雨瞬间笼罩了整个街道 🌧️',
  },
};

export default heavyRain;
