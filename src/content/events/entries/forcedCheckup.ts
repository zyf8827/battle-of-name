import type { EventPoolEntry } from '../../../engine/types';

const forcedCheckup: EventPoolEntry = {
  id: 'event.forced_checkup',
  name: '全员被强制体检 🏥',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'debuff.checkup_fear',
        source: 'ENV',
        name: '扎针恐惧 💉',
        description: '最怕打针',
        tags: ['debuff', 'env'],
        statBonus: { VIT: -2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 被拉去体检，看到针腿软 💉',
      },
    },
    {
      kind: 'DIRECT_HEAL',
      target: 'ALL',
      value: 15,
      tags: ['heal'],
    },
  ],
  texts: {
    trigger: '公司组织全员体检，扎针人人怕 🏥',
  },
};

export default forcedCheckup;
