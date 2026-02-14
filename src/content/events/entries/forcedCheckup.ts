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
        apply: '{targetName} 盯着那根细长的针头，感觉灵魂正在试图离开肉体 💉',
      },
    },
    {
      kind: 'DIRECT_HEAL',
      target: 'ALL',
      value: 15,
      tags: ['heal', 'env'],
    },
  ],
  texts: {
    trigger: '行政部通知：所有人即刻前往会议室参加年度强制体检 🏥',
  },
};

export default forcedCheckup;
