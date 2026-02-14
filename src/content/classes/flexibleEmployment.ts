import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const unemploymentBenefit: Modifier = {
  id: 'class.flexible_employment.benefit',
  source: 'TALENT',
  name: '领失业补助 🪙',
  description: '每回合开始时微量回血。',
  priority: 0,
  tags: ['talent', 'heal'],
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [
        {
          kind: 'DIRECT_HEAL',
          target: 'SELF',
          value: 3,
          tags: ['heal', 'talent'],
        },
      ],
    },
  ],
  texts: {
    trigger: ['{ownerName} 领到了本周的失业补助，生命值恢复了 🪙。'],
  },
};

const desperateMode: Modifier = {
  id: 'class.flexible_employment.desperate_mode',
  source: 'TALENT',
  name: '决一死战 🔥',
  description: '血量<40%时有35%概率进入狂暴状态，攻击力暴增但每回合扣血。',
  priority: 100,
  tags: ['talent'],
  hooks: {
    onTurnStart: ({ engine, owner }) => {
      // 检查是否已经有决一死战buff
      const hasBuff = owner.modifiers.some(
        (m) => m.id === 'class.flexible_employment.desperate_buff',
      );
      if (hasBuff) return;

      // 检查血量是否低于40%
      const hpPercent = owner.state.hp / owner.state.maxHp;
      if (hpPercent >= 0.4) return;

      // 35%概率触发
      if (!engine.rng.bool(0.35, { domain: 'COMBAT', luk: owner.stats.LUK }, 'talent.desperate_mode')) {
        return;
      }

      // 应用决一死战buff
      engine.state.applyModifierEffect(owner, owner, {
        kind: 'APPLY_MODIFIER',
        modifier: {
          id: 'class.flexible_employment.desperate_buff',
          source: 'BUFF',
          name: '决一死战 🔥',
          description: '属性暴增但每回合扣血',
          stacking: {
            stackKey: 'flexible_desperate_mode',
            policy: 'REPLACE',
          },
          duration: 5,
          statBonus: { STR: 20, AGI: 10, VIT: 5, LUK: 5 },
          hooks: {
            onTurnEnd: ({ engine, owner }) => {
              engine.event.emitDirectDamage(owner, owner, 10, ['talent']);
            },
          },
          tags: ['buff'],
        },
      });
    },
  },
  texts: {
    trigger: ['{ownerName} 决定放手一搏！🔥 攻击力大幅提升，但生命值在流逝...'],
    apply: ['{ownerName} 进入决一死战状态！💪 全身燃烧着斗志的火焰！'],
    remove: ['{ownerName} 的决一死战状态结束了。'],
  },
};

const flexibleEmployment: CharacterClass = {
  id: 'class.flexible_employment',
  name: '灵活就业 📦',
  description: '并没有什么正式工作，但胜在自由。',
  baseStats: { STR: 5, AGI: 5, VIT: 5, LUK: 5 }, // 比较基础的面板
  talents: [unemploymentBenefit, desperateMode],
  texts: {
    intro: ['{unitName} 已经连吃一个星期泡面了。'],
  },
};

export default flexibleEmployment;
