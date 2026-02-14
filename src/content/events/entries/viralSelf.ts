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
        apply: '{targetName} 看着几万个赞和疯狂滚动的评论，彻底失去了睡眠的能力 😲',
      },
    },
  ],
  texts: {
    trigger: '睡前最后一次刷新热榜，那段熟悉的社死视频居然排在第一位 📺',
  },
};

export default viralSelf;
