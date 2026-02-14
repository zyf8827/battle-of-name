import type { EventPoolEntry } from '../../../engine/types';

const momentLike: EventPoolEntry = {
  id: 'event.moment_like',
  name: '朋友圈被老板点赞 👍',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.moment_vanity',
        source: 'ENV',
        name: '虚荣满足 🌟',
        description: '老板注意到了我的动态',
        tags: ['buff', 'env'],
        statBonus: { STR: 3, LUK: 2 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 的朋友圈被老板发现了！👍',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 发的朋友圈收到了老板的赞 👋。',
  },
};

export default momentLike;
