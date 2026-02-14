import type { EventPoolEntry } from '../../../engine/types';

const mondayMorning: EventPoolEntry = {
  id: 'event.monday_morning',
  name: '周一早八 ⏰',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.monday_blue',
        source: 'ENV',
        name: '周一综合症 😵',
        description: '灵魂还在床上，甚至想辞职',
        tags: ['debuff', 'env'],
        statBonus: { STR: -3, AGI: -3, VIT: -3, LUK: -3 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 挣扎着坐起来，感觉身体像灌了铅，灵魂还在梦里摸鱼 👻',
      },
    },
  ],
  texts: {
    trigger: '尖锐的闹钟声撕碎了周一清晨的宁静，空气中弥漫着浓厚的绝望 ⏰',
  },
};

export default mondayMorning;
