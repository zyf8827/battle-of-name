import type { Modifier } from '../../../engine/types';

const physicalMitigationStance: Modifier = {
  id: 'seed.start.physical_mitigation_stance',
  source: 'BUFF',
  name: '物理减伤姿态 🥋',
  description: '减少受到的物理伤害。',
  texts: {
    apply: ['{targetName} 启用 {modifierName}，本回合更抗揍 💪。'],
    remove: ['{targetName} 退出 {modifierName}。'],
  },
  duration: 2,
  priority: 10,
  tags: ['buff'],
  stacking: {
    stackKey: 'seed.start.physical_mitigation_stance',
    policy: 'REFRESH_DURATION',
  },
  triggers: [
    {
      trigger: {
        on: 'PIPELINE_INCOMING',
        when: { role: 'TARGET', eventType: 'ATTACK', hasTag: 'physical' },
      },
      effects: [
        {
          kind: 'MITIGATE',
          when: { role: 'TARGET', eventType: 'ATTACK', hasTag: 'physical' },
          multiplier: 0.7,
          min: 1,
        },
      ],
    },
  ],
};

export default physicalMitigationStance;
