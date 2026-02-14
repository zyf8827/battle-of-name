import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const colorfulBlack: Modifier = {
  id: 'class.party_a.colorful_black',
  source: 'TALENT',
  name: '五彩斑斓的黑 🎨',
  description: '提出离谱需求，让对方能力下降。',
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
            id: 'debuff.confusion_demand',
            source: 'TALENT',
            name: '需求混乱 😵',
            description: '逻辑无法自洽',
            tags: ['debuff'],
            statBonus: { AGI: -2, LUK: -2 },
            duration: 2,
            stacking: {
              stackKey: 'debuff.confusion_demand',
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
      '{sourceName} 提出了“五彩斑斓的黑”，{targetName} 陷入了逻辑死循环 🤯。',
    ],
  },
};

const partyA: CharacterClass = {
  id: 'class.party_a',
  name: '甲方爸爸 👔',
  description: '拥有重新定义颜色的权力，擅长精神折磨。',
  baseStats: { STR: 8, AGI: 8, VIT: 12, LUK: 12 },
  talents: [colorfulBlack],
  texts: {
    intro: ['{unitName} 带着修改意见走来了，气场压抑。'],
  },
};

export default partyA;
