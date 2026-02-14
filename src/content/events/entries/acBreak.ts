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
        apply: '{targetName} 感到室温急速上升，汗流浃背，操作都变慢了 🌡️',
      },
    },
  ],
  texts: {
    trigger: '大楼空调主机发出一声闷响，彻底罢工了 ❄️',
  },
};

export default acBreak;
