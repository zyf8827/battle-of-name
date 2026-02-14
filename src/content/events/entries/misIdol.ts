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
        apply:
          '{targetName} 还没反应过来，就被塞了一支笔签名，虚荣心瞬间爆棚 ✨',
      },
    },
  ],
  texts: {
    trigger: '几个扛着长枪短炮的摄影师突然围了上来，闪光灯亮成一片 📸',
  },
};

export default misIdol;
