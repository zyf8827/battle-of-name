import type { EventPoolEntry } from '../../../engine/types';

const momentLeak: EventPoolEntry = {
  id: 'event.moment_leak',
  name: '没屏蔽领导 👁️',
  weight: 8,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.leader_watching',
        source: 'ENV',
        name: '死亡凝视 🧛',
        description: '摸鱼被抓现行',
        tags: ['debuff', 'env'],
        statBonus: { VIT: -3 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 发朋友圈吐槽公司，忘了屏蔽领导！ 💀',
      },
    },
  ],
  texts: {
    trigger: '领导在 {actorName} 的朋友圈点了一个赞 👍。',
  },

};

export default momentLeak;
