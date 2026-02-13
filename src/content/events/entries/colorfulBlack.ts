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
            trigger: { on: 'PIPELINE_OUTGOING', when: { role: 'SOURCE', eventType: 'ATTACK' } },
            effects: [{ kind: 'MITIGATE', when: { role: 'SOURCE', eventType: 'ATTACK' }, multiplier: 0.7 }]
          }
        ]
      },
      textOverrides: {
        apply: '{targetName} 被要求设计“五彩斑斓的黑”，陷入了逻辑死循环 🤯。(伤害降低)',
      },
    },
  ],
  texts: {
    trigger: '甲方提出了一个新的需求：要是五彩斑斓的黑 🖌️。',
  },
};

export default colorfulBlack;
