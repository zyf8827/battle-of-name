import type { EventPoolEntry } from '../../../engine/types';

const recallOk: EventPoolEntry = {
  id: 'event.recall_ok',
  name: '微信撤回成功 💨',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.recall_escape',
        source: 'ENV',
        name: '惊险逃生 💨',
        description: '撤回成功',
        tags: ['buff', 'env'],
        statBonus: { LUK: 3, STR: 1 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 长舒一口气，这种在社死边缘反复横跳的感觉真是太刺激了 ✨',
      },
    },
  ],
  texts: {
    trigger: '发错群的消息在最后几秒钟内，幸运地消失在了气泡中 💨',
  },
};

export default recallOk;
