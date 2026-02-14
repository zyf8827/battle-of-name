import type { EventPoolEntry } from '../../../engine/types';

const fridayMsg: EventPoolEntry = {
  id: 'event.friday_msg',
  name: '下班前的“在吗” 💬',
  weight: 12,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.friday_panic',
        source: 'ENV',
        name: '下班恐惧 😱',
        description: '被老板消息吓出一身冷汗',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -3 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 盯着“在吗”两个字，感觉整个周末都在离自己而去 😱',
      },
    },
  ],
  texts: {
    trigger: '离下班还有五分钟，屏幕右下角闪烁起那个令人生畏的头像 👋',
  },
};

export default fridayMsg;
