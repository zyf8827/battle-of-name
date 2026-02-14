import type { EventPoolEntry } from '../../../engine/types';

const workWrongMsg: EventPoolEntry = {
  id: 'event.work_wrong_msg',
  name: '工作群发错消息 🫣',
  weight: 12,
  effects: [
    {
      kind: 'LOSE_RANDOM_CONSUMABLE',
      target: 'SELF',
      count: 1,
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.work_msg_panic',
        source: 'ENV',
        name: '撤回失败 🚫',
        description: '超过了2分钟，无法撤回',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -3, LUK: -3 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 在工作群发了不该发的消息...超过2分钟了 🫣',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 在工作群发了消息，抬头发现是...隔壁吐槽群 🫣',
  },
};

export default workWrongMsg;
