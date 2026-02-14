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

const flexibleEmployment: CharacterClass = {
  id: 'class.flexible_employment',
  name: '灵活就业 📦',
  description: '并没有什么正式工作，但胜在自由。',
  baseStats: { STR: 5, AGI: 5, VIT: 5, LUK: 5 }, // 比较基础的面板
  talents: [unemploymentBenefit],
  texts: {
    intro: ['{unitName} 已经连吃一个星期泡面了。'],
  },
};

export default flexibleEmployment;
