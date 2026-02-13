import type { EventPoolEntry } from '../../../engine/types';

const mondayMorning: EventPoolEntry = {
  id: 'event.monday_morning',
  name: '周一早八 ⏰',
  weight: 12,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.monday_blue',
        source: 'ENV',
        name: '周一综合症 😵',
        description: '灵魂还在床上',
        tags: ['debuff', 'env'],
        statBonus: { STR: -1, AGI: -1, VIT: -1, LUK: -1 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 被五个闹钟叫醒，灵魂出窍了 👻。(全属性 -1)',
      },
    },
  ],
  texts: {
    trigger: '今天是周一，{actorName} 准时被早八的闹钟摧毁了意志 🛌。',
  },

};

export default mondayMorning;
