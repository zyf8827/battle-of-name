import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const adrenalineRush: Modifier = {
  id: 'consumable.adrenaline_shot.rush',
  source: 'BUFF',
  name: '肾上腺冲刺 ⚡',
  description: '短时兴奋，提升输出节奏。',
  duration: 2,
  priority: 6,
  tags: ['buff'],
  stacking: { stackKey: 'consumable.adrenaline_shot.rush', policy: 'REFRESH_DURATION' },
  statBonus: { STR: 2, AGI: 2 },
};

const adrenalineShot: Consumable = {
  id: 'consumable.adrenaline_shot',
  name: '应急肾上腺素 💉',
  description: '临场提神道具，强调短时爆发感。',
  effects: [
    { kind: 'DIRECT_HEAL', target: 'SELF', value: 10, tags: ['heal'] },
    { kind: 'APPLY_MODIFIER', target: 'SELF', modifier: adrenalineRush, duration: 2 },
  ],
  texts: {
    use: [
      '{unitName} 使用 {itemName}，状态瞬间拉满 🚀。',
      '{unitName} 打开 {itemName}，手感和反应都进入高档位 🏎️。',
      '{unitName} 来了一针 {itemName}，准备硬接下一波 😤。',
    ],
  },
};

export default adrenalineShot;
