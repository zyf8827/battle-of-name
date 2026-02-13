import type { Modifier } from '../../../engine/types';

const shieldAtRoundStart: Modifier = {
  id: 'seed.start.shield_at_round_start',
  source: 'BUFF',
  name: '回合护盾 🛡️',
  description: '每回合开始获得护盾。',
  texts: {
    apply: ['{targetName} 获得 {modifierName}，进入防护状态 🔒。'],
    remove: ['{targetName} 的 {modifierName} 到期。'],
  },
  duration: 3,
  priority: 0,
  tags: ['buff', 'shield'],
  stacking: { stackKey: 'seed.start.shield_at_round_start', policy: 'REFRESH_DURATION' },
  triggers: [
    {
      trigger: { on: 'ROUND_START' },
      effects: [
        {
          kind: 'SHIELD',
          value: [
            { type: 'SCALE', stat: 'STR', ratio: 0.5 },
            { type: 'FLAT', value: 10 },
          ],
          tags: ['shield'],
        },
      ],
    },
  ],
};

export default shieldAtRoundStart;
