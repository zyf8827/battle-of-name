import type { Consumable } from '../base/consumable';

const cola: Consumable = {
  id: 'consumable.cola',
  name: '肥宅快乐水 🥤',
  description: '快乐源泉，一口入魂。回复生命并净化状态。',
  effects: [
    { kind: 'DIRECT_HEAL', target: 'SELF', value: 25, tags: ['heal'] },
    { kind: 'DISPEL', target: 'SELF', mode: 'DEBUFF', max: 1 },
  ],
  texts: {
    use: ['{unitName} 吨吨吨喝下 {itemName}，感觉快乐回来了！✨'],
  },
};

export default cola;
