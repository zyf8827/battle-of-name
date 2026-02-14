import type { EventPoolEntry } from '../../../engine/types';

const colorfulBlack: EventPoolEntry = {
  id: 'event.colorful_black',
  name: '五彩斑斓的黑 🎨',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.confusion_design',
        source: 'ENV',
        name: '需求混乱 😵‍💫',
        description: '完全听不懂甲方的要求',
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
                multiplier: 0.7,
              },
            ],
          },
        ],
      },
      textOverrides: {
        apply: '{targetName} 面对离谱要求瞬间红码，逻辑 CPU 负载过高 🤯',
      },
    },
  ],
  texts: {
    trigger: '甲方推门而入：“我们要那种五彩斑斓的黑，你懂吧？” 🎨',
  },
};

export default colorfulBlack;
