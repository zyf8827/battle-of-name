import type { EventPoolEntry } from '../../../engine/types';

const afternoonTea: EventPoolEntry = {
  id: 'event.afternoon_tea',
  name: '下午茶时间 ☕',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'buff.tea_time',
        source: 'ENV',
        name: '茶歇时光 ☕',
        description: '享受下午茶',
        tags: ['buff', 'env'],
        statBonus: { VIT: 2, LUK: 1 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 暂时放下工作，在茶点中找回了灵魂 🧁',
      },
    },
    {
      kind: 'GRANT_RANDOM_CONSUMABLE',
      target: 'ALL',
    },
  ],
  texts: {
    trigger: '{actorName} 发起了下午茶拼单 ☕',
  },
};

export default afternoonTea;
