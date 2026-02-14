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
        apply:
          '{targetName} 疯狂长按气泡，却发现撤回选项已经无情消失，时间刚好过去两分零一秒 💀',
      },
    },
  ],
  texts: {
    trigger: '消息发出的瞬间，大脑皮层突然尖叫：回错群了！🫣',
  },
};

export default workWrongMsg;
