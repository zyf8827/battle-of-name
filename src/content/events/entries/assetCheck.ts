import type { EventPoolEntry } from '../../../engine/types';

const assetCheck: EventPoolEntry = {
  id: 'event.asset_check',
  name: '公司资产盘点 📋',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.asset_anxiety',
        source: 'ENV',
        name: '资产焦虑 😰',
        description: '被查资产的紧张',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -3, LUK: -3 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 面对行政的铁面无私，乖乖交出了由于生产力工具 💸',
      },
    },
    {
      kind: 'LOSE_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '行政部突然发动“资产大清查”，现场一片混乱 📋',
  },
};

export default assetCheck;
