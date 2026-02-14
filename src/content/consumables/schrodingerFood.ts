import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

// 这是一个延迟触发的随机盒子
const observing: Modifier = {
  id: 'consumable.schrodinger_food.observing',
  source: 'BUFF',
  name: '观测中 📦',
  description: '下一回合揭晓结果...',
  duration: 1,
  tags: ['buff'],
  hooks: {
    onTurnStart: ({ engine, owner }) => {
      // 50% 概率好，50% 概率坏
      if (engine.rng.bool(0.5, { domain: 'EVENT', luk: owner.stats.LUK })) {
        // Good
        engine.event.emitDirectHeal(owner, owner, 30, ['heal', 'magic']);
        engine.state.applyModifierEffect(owner, owner, {
          kind: 'APPLY_MODIFIER',
          modifier: {
            id: 'buff.schrodinger_good',
            source: 'BUFF',
            name: '活猫 🐱',
            description: '是好结局！',
            duration: 2,
            statBonus: { LUK: 5, STR: 3 },
            tags: ['buff'],
          },
        });
      } else {
        // Bad
        engine.event.emitDirectDamage(owner, owner, 20, ['magic']);
        engine.state.applyModifierEffect(owner, owner, {
          kind: 'APPLY_MODIFIER',
          modifier: {
            id: 'debuff.schrodinger_bad',
            source: 'BUFF',
            name: '死猫 ☠️',
            description: '运气不好...',
            duration: 2,
            statBonus: { LUK: -5, VIT: -2 },
            tags: ['debuff'],
          },
        });
      }
    },
  },
};

const schrodingerFood: Consumable = {
  id: 'consumable.schrodinger_food',
  name: '薛定谔的猫粮 🥫',
  description: '不知道有没有毒。下一回合随机触发好运或厄运。',
  effects: [{ kind: 'APPLY_MODIFIER', target: 'SELF', modifier: observing }],
  texts: {
    use: ['{unitName} 吃下了 {itemName}，正在等待命运的审判... 🤔'],
  },
};

export default schrodingerFood;
