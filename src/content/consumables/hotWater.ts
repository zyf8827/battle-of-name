import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const warmInside: Modifier = {
  id: 'consumable.hot_water.warm',
  source: 'BUFF',
  name: '暖暖的 ♨️',
  description: '多喝热水，包治百病。',
  duration: 1,
  tags: ['buff'],
  // 免疫控制的实现：在 ControlResolver 中检查 buff tags?
  // 或者这里直接给一个高抗性?
  // 引擎默认实现检查 tags.includes('control') 作为控制源。
  // 我们这里只做文案和 Dispel 效果。
};

const hotWater: Consumable = {
  id: 'consumable.hot_water',
  name: '热水 🍵',
  description: '万能的药，回血并解除控制/减益。',
  effects: [
    { kind: 'DIRECT_HEAL', target: 'SELF', value: 15, tags: ['heal'] },
    { kind: 'DISPEL', target: 'SELF', mode: 'DEBUFF', max: 2 }, // 驱散2个
    { kind: 'APPLY_MODIFIER', target: 'SELF', modifier: warmInside },
  ],
  texts: {
    use: ['{unitName} 端起保温杯喝了口 {itemName}，感觉好多了 😌。'],
  },
};

export default hotWater;
