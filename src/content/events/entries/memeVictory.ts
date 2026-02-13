import type { EventPoolEntry } from '../../../engine/types';

const memeVictory: EventPoolEntry = {
  id: 'event.meme_victory',
  name: '斗图胜利 🖼️',
  weight: 12,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.meme_lord',
        source: 'ENV',
        name: '表情包之王 👑',
        description: '气势上的绝对压制',
        tags: ['buff', 'env'],
        statBonus: { STR: 2, LUK: 2 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 掏出了珍藏多年的熊猫头，瞬间制霸全场！ 🐼',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 在斗图中大获全胜，对方已无图可发 🚮。',
  },

};

export default memeVictory;
