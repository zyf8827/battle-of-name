import type { EventPoolEntry } from '../../../engine/types';

const badHaircut: EventPoolEntry = {
  id: 'event.bad_haircut',
  name: '理发师的“一点点” 💇',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.ugly_hair',
        source: 'ENV',
        name: '发型崩坏 🗿',
        description: '丑到不敢见人',
        tags: ['debuff', 'env'],
        statBonus: { LUK: -5 },
        duration: 3,
      },
      textOverrides: {
        apply: '{targetName} 被托尼老师剪坏了刘海，魅力值归零 📉。',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 相信了理发师说的“只修一点点” 🤡。',
  },

};

export default badHaircut;
