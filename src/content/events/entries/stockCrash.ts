import type { EventPoolEntry } from '../../../engine/types';

const stockCrash: EventPoolEntry = {
  id: 'event.stock_crash',
  name: '重仓股票腰斩 📉',
  weight: 6,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.stock_misery',
        source: 'ENV',
        name: '倾家荡产 💸',
        description: '天台风很大',
        tags: ['debuff', 'env'],
        statBonus: { STR: -5, VIT: -5 },
        duration: 3,
      },
      textOverrides: {
        apply: '{targetName} 看着绿油油的屏幕，感觉呼吸都在痛 📉',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 打开了交易软件，发现持仓已经变成了负数 📉',
  },
};

export default stockCrash;
