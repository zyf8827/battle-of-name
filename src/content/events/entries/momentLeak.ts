import type { EventPoolEntry } from '../../../engine/types';

const momentLeak: EventPoolEntry = {
  id: 'event.moment_leak',
  name: '没屏蔽领导 👁️',
  weight: 6,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.leader_watching',
        source: 'ENV',
        name: '死亡凝视 🧛',
        description: '摸鱼被抓现行，职业生涯危在旦夕',
        tags: ['debuff', 'env'],
        statBonus: { VIT: -8, LUK: -5 },
        duration: 3,
      },
      textOverrides: {
        apply: '{targetName} 感到一股透心凉的死寂之气从脊梁骨升起，整个人都僵住了 💀',
      },
    },
  ],
  texts: {
    trigger: '刚刚发出的吐槽朋友圈，在三秒后竟然出现了一个领导本人的点赞 👍',
  },
};

export default momentLeak;
