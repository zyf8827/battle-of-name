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
        apply: '{targetName} 的头皮随着震动一起颤抖，感觉整个人都要裂开了 🙉',
      },
    },
  ],
  texts: {
    trigger: '清晨八点整，楼上准时传来了仿佛要钻穿地心的电钻轰鸣声 🚧',
  },
};

export default neighborRenovation;
