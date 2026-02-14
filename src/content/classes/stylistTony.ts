import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const justALittleBit: Modifier = {
  id: 'class.tony.little_bit',
  source: 'TALENT',
  name: '只剪一点点 ✂️',
  description: '每次攻击永久削弱对手的属性。',
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
            id: 'debuff.bad_haircut',
            source: 'TALENT',
            name: '发型崩坏',
            description: '这叫一点点？',
            tags: ['debuff'],
            statBonus: { LUK: -1, VIT: -1 },
            duration: -1, // 永久
            stacking: {
              stackKey: 'debuff.bad_haircut',
              policy: 'STACK',
              maxStacks: 10,
            },
          },
        },
      ],
    },
  ],
  texts: {
    trigger: ['{sourceName} 手起刀落，{targetName} 感觉头顶凉飕飕的 💇‍♂️。'],
  },
};

const stylistTony: CharacterClass = {
  id: 'class.tony',
  name: '托尼老师 💈',
  description: '拥有独特的计量单位，他的“一点点”通常是指亿点点。',
  baseStats: { STR: 8, AGI: 14, VIT: 8, LUK: 10 }, // 高敏捷
  talents: [justALittleBit],
  texts: {
    intro: ['{unitName} 正在擦拭剪刀，询问你想要什么发型。'],
  },
};

export default stylistTony;
