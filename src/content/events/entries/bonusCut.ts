import type { EventPoolEntry } from '../../../engine/types';

const bonusCut: EventPoolEntry = {
  id: 'event.bonus_cut',
  name: '年终奖大跳水 📉',
  weight: 4, // 权重较低，作为强力负面事件
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'debuff.bonus_cut_misery',
        source: 'ENV',
        name: '心情极度低落 📉',
        description: '年终奖没了他还不让我走',
        tags: ['debuff', 'env'],
        statBonus: { STR: -5 },
        duration: 3,
      },
      textOverrides: {
        apply: '{targetName} 看着个位数的奖金，感觉手里的武器都拿不稳了 💔',
      },
    },
  ],
  texts: {
    trigger: '全员收到通知：由于公司业绩“结构性优化”，今年年终奖取消 📉',
  },
};

export default bonusCut;
