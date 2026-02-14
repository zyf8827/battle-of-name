import type { EventPoolEntry } from '../../../engine/types';

const viralSelf: EventPoolEntry = {
  id: 'event.viral_self',
  name: '凌晨刷到自己视频 📺',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.viral_shock',
        source: 'ENV',
        name: '上榜震惊 😲',
        description: '自己上热门了',
        tags: ['buff', 'env'],
        statBonus: { LUK: 4, STR: 2 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 刷到自己的视频上了热门 📺',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 凌晨刷视频，刷到...自己？！📺',
  },
};

export default viralSelf;
