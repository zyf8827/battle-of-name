import type { EventPoolEntry } from '../../../engine/types';

const midnightEmo: EventPoolEntry = {
  id: 'event.midnight_emo',
  name: '深夜网抑云 🌙',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.emo',
        source: 'ENV',
        name: '生而为人 🥀',
        description: '我很抱歉，且不想奋斗了',
        tags: ['debuff', 'env'],
        statBonus: { STR: -6, LUK: -4 },
        duration: 3,
      },
      textOverrides: {
        apply: '{targetName} 沉浸在忧郁的旋律中，感觉整个人都被黑洞吸走了 🥀',
      },
    },
  ],
  texts: {
    trigger: '午夜的钟声响起，房间里只剩下冷冰冰的手机荧光和一声长叹 🌙',
  },
};

export default midnightEmo;
