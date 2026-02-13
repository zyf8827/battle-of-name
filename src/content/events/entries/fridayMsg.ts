import type { EventPoolEntry } from '../../../engine/types';

const fridayMsg: EventPoolEntry = {
  id: 'event.friday_msg',
  name: '下班前的“在吗” 💬',
  weight: 12,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.friday_panic',
        source: 'ENV',
        name: '下班恐惧 😱',
        description: '被老板消息吓出一身冷汗',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -3 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 收到老板微信“在吗”，瞬间僵硬 🧊。',
      },
    },
  ],
  texts: {
    trigger: '周五临下班五分钟，{actorName} 收到了来自老板的亲切问候 👋。',
  },

};

export default fridayMsg;
