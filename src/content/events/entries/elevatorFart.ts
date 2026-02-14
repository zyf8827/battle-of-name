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
        apply: '{targetName} 的屁被同事认出了！💀',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 在电梯里放了个屁，同事说：又是你吧 💨',
  },
};

export default elevatorFart;
