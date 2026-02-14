import type { EventPoolEntry } from '../../../engine/types';

const loveBrain: EventPoolEntry = {
  id: 'event.love_brain',
  name: '恋爱脑发作 🧠❤️',
  weight: 8,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.love_blind',
        source: 'ENV',
        name: '智商掉线 📉',
        description: '脑子里全是 ta',
        tags: ['debuff', 'env'],
        duration: 2,
        triggers: [
          {
            trigger: {
              on: 'PIPELINE_OUTGOING',
              when: { role: 'SOURCE', eventType: 'ATTACK' },
            },
            effects: [
              {
                kind: 'MITIGATE',
                when: { role: 'SOURCE', eventType: 'ATTACK' },
                multiplier: 0.5,
              },
            ],
          },
        ],
      },
      textOverrides: {
        apply: '{targetName} 开始对着手机傻笑，完全忘了还在战斗 🫠',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 收到了暗恋对象的点赞，瞬间魂不守舍 🧠❤️',
  },
};

export default loveBrain;
