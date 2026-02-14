import type { EventPoolEntry } from '../../../engine/types';

const otFriday: EventPoolEntry = {
  id: 'event.ot_friday',
  name: '周五被点名加班 📅',
  weight: 12,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.friday_ot_heartbreak',
        source: 'ENV',
        name: '周五加班症 💔',
        description: '原本计划全泡汤',
        tags: ['debuff', 'env'],
        statBonus: { VIT: -3, AGI: -2 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 收到加班通知，心碎了一地 💔',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 准备下班，老板点名：你留下来加班 📅',
  },
};

export default otFriday;
