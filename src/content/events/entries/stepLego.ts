import type { EventPoolEntry } from '../../../engine/types';

const stepLego: EventPoolEntry = {
  id: 'event.step_lego',
  name: '踩到乐高 🦶',
  weight: 6,
  effects: [
    {
      kind: 'DIRECT_DAMAGE',
      target: 'SELF',
      value: 40,
      tags: ['env', 'true_damage'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.foot_pain',
        source: 'ENV',
        name: '脚底板穿刺 🧱',
        description: '会呼吸的痛，灵魂都在颤抖',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -5 },
        duration: 2,
      },
    },
  ],
  texts: {
    trigger: '{actorName} 光脚精准踩到了乐高积木！发出了一声贯穿整栋楼的惨叫！📢',
  },
};

export default stepLego;
