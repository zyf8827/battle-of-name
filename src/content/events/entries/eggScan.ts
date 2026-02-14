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
        apply: '{targetName} 拎着一盒鸡蛋，虽然占了便宜但总觉得哪里不对 🥚',
      },
    },
  ],
  texts: {
    trigger: '路边超市正在搞活动，只要扫码关注就送新鲜鸡蛋 🥚',
  },
};

export default eggScan;
