import type { EventPoolEntry } from '../../../engine/types';

const eggScan: EventPoolEntry = {
  id: 'event.egg_scan',
  name: '扫码领鸡蛋 🥚',
  weight: 10,
  effects: [
    {
      kind: 'GRANT_RANDOM_CONSUMABLE',
      target: 'SELF',
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.egg_gain',
        source: 'ENV',
        name: '贪小便宜 🥚',
        description: '扫码换的鸡蛋',
        tags: ['buff', 'env'],
        statBonus: { LUK: 2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 扫码领了一盒鸡蛋 🥚',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 路过扫码点，排了半小时队领鸡蛋 🥚',
  },
};

export default eggScan;
