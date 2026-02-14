import type { EventPoolEntry } from '../../../engine/types';

const acBreak: EventPoolEntry = {
  id: 'event.ac_break',
  name: '空调集体失灵 ❄️',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'debuff.ac_break_misery',
        source: 'ENV',
        name: '冬冷夏热 🌡️',
        description: '空调集体罢工',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -2 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 因为空调故障，浑身难受 🌡️',
      },
    },
  ],
  texts: {
    trigger: '大楼空调集体失灵，全员享受冬冷夏热 ❄️',
  },
};

export default acBreak;
