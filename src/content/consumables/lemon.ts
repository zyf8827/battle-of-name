import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const sour: Modifier = {
  id: 'consumable.lemon.sour',
  source: 'BUFF',
  name: '酸了 🍋',
  description: '嫉妒使人面目全非。',
  duration: 2,
  tags: ['debuff'],
  statBonus: { STR: -3, LUK: -3 },
};

const lemon: Consumable = {
  id: 'consumable.lemon',
  name: '柠檬 🍋',
  description: '我酸了。降低敌方力量和幸运。',
  effects: [{ kind: 'APPLY_MODIFIER', target: 'TARGET', modifier: sour }],
  texts: {
    use: ['{unitName} 强行喂了 {targetName} 一颗 {itemName}，酸得对方五官扭曲 😖。'],
  },
};

export default lemon;
