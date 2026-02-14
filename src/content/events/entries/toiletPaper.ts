import type { EventPoolEntry } from '../../../engine/types';

const toiletPaper: EventPoolEntry = {
  id: 'event.toilet_paper',
  name: '路人借厕纸成功 🧻',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.toilet_kindness',
        source: 'ENV',
        name: '善良小确幸 💚',
        description: '帮助了陌生人',
        tags: ['buff', 'env'],
        statBonus: { LUK: 2, VIT: 1 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 帮助了路人，感觉暖暖的 🧻',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 在公厕，隔壁隔间传来：能借张纸吗？🧻',
  },
};

export default toiletPaper;
