import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const emotionalDamage: Modifier = {
  id: 'class.driving_instructor.emotional_damage',
  source: 'TALENT',
  name: '语言艺术 🗣️',
  description: '每次攻击都夹杂着精神攻击，叠加压力。',
  priority: 0,
  tags: ['talent', 'debuff'],
  triggers: [
    {
      trigger: {
        on: 'ON_HIT',
        when: { role: 'SOURCE', notHasTag: 'miss' },
      },
      effects: [
        {
          kind: 'APPLY_MODIFIER',
          target: 'TARGET',
          modifier: {
            id: 'debuff.stress',
            source: 'TALENT',
            name: '学员压力 💢',
            description: '我怎么教了你这么个笨蛋',
            tags: ['debuff'],
            statBonus: { AGI: -1, STR: -1 },
            duration: 3,
            stacking: {
              stackKey: 'debuff.stress',
              policy: 'STACK',
              maxStacks: 3,
            },
          },
        },
      ],
    },
  ],
  texts: {
    trigger: [
      '{sourceName} 开始了阴阳怪气：“方向盘上挂个肉包子狗都比你会开！” 🐶',
    ],
  },
};

const drivingInstructor: CharacterClass = {
  id: 'class.driving_instructor',
  name: '驾校教练 🚗',
  description: '拥有独特的语言天赋，能让最自信的人怀疑人生。',
  baseStats: { STR: 11, AGI: 8, VIT: 11, LUK: 6 },
  talents: [emotionalDamage],
  texts: {
    intro: ['{unitName} 点了一根烟，斜眼看着对手。'],
  },
};

export default drivingInstructor;
