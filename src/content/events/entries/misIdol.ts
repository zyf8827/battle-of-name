import type { EventPoolEntry } from '../../../engine/types';

const misIdol: EventPoolEntry = {
  id: 'event.mis_idol',
  name: '路上被误认成网红 📸',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.mis_idol_vanity',
        source: 'ENV',
        name: '小虚荣 ✨',
        description: '居然被当成网红',
        tags: ['buff', 'env'],
        statBonus: { LUK: 2, AGI: 1 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 被路人当成网红要签名 📸',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 走在路上，被路人拦住：能合个影吗？📸',
  },
};

export default misIdol;
