import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const luckyKoi: Modifier = {
  id: 'consumable.koi_amulet.luck',
  source: 'BUFF',
  name: '锦鲤附体 🐟',
  description: '转发这条锦鲤...',
  duration: 2,
  tags: ['buff'],
  statBonus: { LUK: 10 }, // 巨额幸运
};

const koiAmulet: Consumable = {
  id: 'consumable.koi_amulet',
  name: '锦鲤护身符 🧧',
  description: '玄学道具，大幅提升幸运。',
  effects: [{ kind: 'APPLY_MODIFIER', target: 'SELF', modifier: luckyKoi }],
  texts: {
    use: ['{unitName} 拿出了 {itemName} 拜了三拜，欧气暴涨！🙏'],
  },
};

export default koiAmulet;
