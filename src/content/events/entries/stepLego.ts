import type { EventPoolEntry } from '../../../engine/types';

const stepLego: EventPoolEntry = {
  id: 'event.step_lego',
  name: '踩到乐高 🦶',
  weight: 8,
  effects: [
    {
      kind: 'DIRECT_DAMAGE',
      target: 'SELF',
      value: 20,
      tags: ['env', 'true_damage'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.foot_pain',
        source: 'ENV',
        name: '脚底板穿刺 🧱',
        description: '会呼吸的痛',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -2 },
        duration: 1,
      },
    },
  ],
  texts: {
    trigger: '{actorName} 光脚踩到了乐高积木！发出了一声惨叫！📢',
  },

};

export default stepLego;
