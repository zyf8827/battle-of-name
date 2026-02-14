import type { EventPoolEntry } from '../../../engine/types';

const elevatorFart: EventPoolEntry = {
  id: 'event.elevator_fart',
  name: '电梯放屁被认出 💨',
  weight: 12,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.elevator_fart_social',
        source: 'ENV',
        name: '电梯社死 💨',
        description: '声纹被同事识别',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -4, LUK: -3 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 试图装作若无其事，但同事精准的视线已经锁定了过来 💀',
      },
    },
  ],
  texts: {
    trigger: '电梯里的空气突然凝固，一股不可名状的气息悄然扩散 💨',
  },
};

export default elevatorFart;
