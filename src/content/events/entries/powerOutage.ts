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
             trigger: { on: 'PIPELINE_INCOMING', when: { role: 'SOURCE', eventType: 'ATTACK' } },
             effects: [{ kind: 'MITIGATE', when: { role: 'SOURCE', eventType: 'ATTACK' }, multiplier: 0.5 }]
           }
        ]
      },
      textOverrides: {
        apply: '{targetName} 在黑暗中摸索，命中率大幅下降！🔦',
      },
    },
  ],
  texts: {
    trigger: '随着“啪”的一声，全世界都黑了。停电了！🌚',
  },
};

export default powerOutage;
