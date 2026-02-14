import type { CharacterClass } from '../base/characterClass';
import type { Modifier } from '../../engine/types';

const ironBowl: Modifier = {
  id: 'class.civil_servant.iron_bowl',
  source: 'TALENT',
  name: '铁饭碗 🍚',
  description: '极高的稳定性，常驻双抗。',
  priority: 0,
  tags: ['talent'],
  triggers: [
    {
      trigger: {
        on: 'PIPELINE_INCOMING',
        when: { role: 'TARGET', eventType: 'ATTACK' },
      },
      effects: [
        { kind: 'MITIGATE', when: { role: 'TARGET', eventType: 'ATTACK' }, multiplier: 0.9 },
      ],
    },
  ],
  texts: {
    trigger: ['{targetName} 凭借编制的加持，从容化解了攻势 🛡️。'],
  },
};

const civilServant: CharacterClass = {
  id: 'class.civil_servant',
  name: '考公上岸人 👔',
  description: '一旦上岸，稳如泰山。',
  baseStats: { STR: 7, AGI: 7, VIT: 15, LUK: 8 },
  talents: [ironBowl],
  texts: {
    intro: ['{unitName} 拿出了保温杯，泡好了枸杞，准备开始工作。'],
  },
};

export default civilServant;
