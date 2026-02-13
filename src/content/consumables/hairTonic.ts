import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const hairGrowth: Modifier = {
  id: 'consumable.hair_tonic.growth',
  source: 'BUFF',
  name: '毛囊复苏 🌱',
  description: '发量回归，自信回归。',
  duration: 3,
  tags: ['buff'],
  statBonus: { LUK: 4, VIT: 2 },
};

const hairTonic: Consumable = {
  id: 'consumable.hair_tonic',
  name: '生发水 🧴',
  description: '变强了，头发也长出来了？提升幸运和体质。',
  effects: [
    { kind: 'APPLY_MODIFIER', target: 'SELF', modifier: hairGrowth },
  ],
  texts: {
    use: ['{unitName} 往头上倒了半瓶 {itemName}，感觉头顶在发光 ✨。'],
  },
};

export default hairTonic;
