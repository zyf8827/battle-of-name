import type { Consumable } from '../base/consumable';

const fillerItem: Consumable = {
  id: 'consumable.filler_item',
  name: '满减凑单品 🧦',
  description: '食之无味弃之可惜。获得微量护盾。',
  effects: [
    { kind: 'SHIELD', target: 'SELF', value: [{ type: 'FLAT', value: 15 }], tags: ['shield'] },
  ],
  texts: {
    use: ['{unitName} 勉强用了一下 {itemName}，聊胜于无 🤷‍♂️。'],
  },
};

export default fillerItem;
