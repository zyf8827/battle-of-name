import type { EventPoolEntry } from '../../../engine/types';

const coldShower: EventPoolEntry = {
  id: 'event.cold_shower',
  name: '洗澡水变冷 🚿',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.cold',
        source: 'ENV',
        name: '透心凉 🥶',
        description: '燃气热水器突然熄火',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -2, VIT: -1 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 发出了一声刺破耳膜的尖叫，感觉血液都凝固了 🧊',
      },
    },
  ],
  texts: {
    trigger: '燃气热水器由于欠费，在最关键的时刻无情熄火 🚿',
  },
};

export default coldShower;
