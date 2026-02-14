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
        apply: '{targetName} 感到一股透心凉的寒意从脊梁骨升起，职业生涯仿佛看到了尽头 💀',
      },
    },
  ],
  texts: {
    trigger: '刚刚发出的吐槽朋友圈，在三秒后出现了一个熟悉的头像点赞 👍',
  },
};

export default momentLeak;
