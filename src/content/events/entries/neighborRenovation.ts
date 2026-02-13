import type { EventPoolEntry } from '../../../engine/types';

const neighborRenovation: EventPoolEntry = {
  id: 'event.neighbor_renovation',
  name: '楼上装修 🚧',
  weight: 8,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'debuff.noise',
        source: 'ENV',
        name: '电钻惊魂 🔨',
        description: '魔音贯耳，无法集中注意力',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -1, STR: -1 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 被电钻声吵得脑瓜子嗡嗡的！ 🙉',
      },
    },
  ],
  texts: {
    trigger: '楼上的邻居开始了神圣的装修仪式：哒哒哒哒哒！🏗️',
  },
};

export default neighborRenovation;
