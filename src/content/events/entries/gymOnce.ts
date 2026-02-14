import type { EventPoolEntry } from '../../../engine/types';

const gymOnce: EventPoolEntry = {
  id: 'event.gym_once',
  name: '健身卡终于用了一次 💪',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.gym_achievement',
        source: 'ENV',
        name: '健身成就 🏆',
        description: '办卡后第一次去',
        tags: ['buff', 'env'],
        statBonus: { STR: 3, VIT: 2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 踏上跑步机的瞬间，感觉整个人都被正能量包围了 🏆',
      },
    },
  ],
  texts: {
    trigger: '在抽屉缝隙里发现了那张落满灰尘的健身卡，良心突然痛了一下 💪',
  },
};

export default gymOnce;
