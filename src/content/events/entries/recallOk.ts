import type { EventPoolEntry } from '../../../engine/types';

const recallOk: EventPoolEntry = {
  id: 'event.recall_ok',
  name: '微信撤回成功 💨',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.recall_escape',
        source: 'ENV',
        name: '惊险逃生 💨',
        description: '撤回成功',
        tags: ['buff', 'env'],
        statBonus: { LUK: 3, STR: 1 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 手速惊人，撤回成功 💨',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 发错消息，在1分59秒时成功撤回 💨',
  },
};

export default recallOk;
