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
        apply: '{targetName} 洗澡洗一半没热水了！冻得瑟瑟发抖 🧊。',
      },
    },
  ],
  texts: {
    trigger: '热水器突然坏了，{actorName} 体验了一把冰桶挑战 ⛄。',
  },

};

export default coldShower;
