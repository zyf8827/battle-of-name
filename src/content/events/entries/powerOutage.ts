import type { EventPoolEntry } from '../../../engine/types';

const powerOutage: EventPoolEntry = {
  id: 'event.power_outage',
  name: '突发停电 🕯️',
  weight: 6,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'debuff.darkness',
        source: 'ENV',
        name: '两眼一抹黑 🕶️',
        description: '一片漆黑，啥也看不见',
        tags: ['debuff', 'env', 'miss'],
        duration: 1,
        triggers: [
          {
            trigger: {
              on: 'PIPELINE_INCOMING',
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
        apply: '{targetName} 绝望地发现还没保存的文档，在黑暗中发出了无声的哀号 🌚',
      },
    },
  ],
  texts: {
    trigger: '随着一声沉闷的跳闸声，整栋大楼陷入了死寂般的黑暗 🕯️',
  },
};

export default powerOutage;
