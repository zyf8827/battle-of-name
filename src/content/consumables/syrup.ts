import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const sugarRush: Modifier = {
  id: 'consumable.syrup.rush',
  source: 'BUFF',
  name: '急支糖浆 🐆',
  description: '为什么追我？',
  duration: 2,
  tags: ['buff'],
  statBonus: { AGI: 8 }, // 巨额移速
  stacking: { stackKey: 'buff.speed_boost', policy: 'REFRESH_DURATION' },
};

const syrup: Consumable = {
  id: 'consumable.syrup',
  name: '急支糖浆 🌿',
  description: '喝了就会跑得很快（大概是被豹子追的）。',
  effects: [{ kind: 'APPLY_MODIFIER', target: 'SELF', modifier: sugarRush }],
  texts: {
    use: ['{unitName} 喝下 {itemName}，突然感觉背后有豹子在追！🏃‍♂️'],
  },
};

export default syrup;
