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
        apply: '{targetName} 祭出了压箱底的绝版熊猫头，完成了最后的绝杀 👑',
      },
    },
  ],
  texts: {
    trigger: '大群里的表情包对攻进入白热化，对方的库存显然已经见底了 🖼️',
  },
};

export default memeVictory;
