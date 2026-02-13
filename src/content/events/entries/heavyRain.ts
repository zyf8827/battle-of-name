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
        apply: '{targetName} 被淋成了落汤鸡！ 💦',
      },
    },
  ],
  texts: {
    trigger: '天空突然下起了倾盆大雨，而大家都没带伞 ☔。',
  },
};

export default heavyRain;
