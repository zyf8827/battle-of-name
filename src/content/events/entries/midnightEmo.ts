import type { EventPoolEntry } from '../../../engine/types';

const midnightEmo: EventPoolEntry = {
  id: 'event.midnight_emo',
  name: '深夜网抑云 🌙',
  weight: 12,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.emo',
        source: 'ENV',
        name: '生而为人 🥀',
        description: '我很抱歉',
        tags: ['debuff', 'env'],
        statBonus: { STR: -3, LUK: -2 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 打开了评论区，眼泪止不住地流 💧。',
      },
    },
  ],
  texts: {
    trigger: '到了十二点，{actorName} 准时带上了耳机，开启了网抑云模式 🎧。',
  },

};

export default midnightEmo;
