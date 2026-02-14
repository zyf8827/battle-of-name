import type { EquipmentLike } from '../base/equipment';

const disconnectShell: EquipmentLike = {
  id: 'equip.disconnect_shell',
  source: 'EQUIP',
  slot: 'ARMOR',
  rarity: 'RARE',
  name: '断网保护壳 🛡️',
  description: '对持续掉血有天然抗性，网络再差也不崩。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.disconnect_shell', policy: 'IGNORE' },
  statBonus: { VIT: 2 },
  triggers: [
    {
      trigger: { on: 'PIPELINE_INCOMING' },
      effects: [
        {
          kind: 'MITIGATE',
          when: { role: 'TARGET', eventType: 'ATTACK', hasTag: 'dot' },
          multiplier: 0.75,
          min: 1,
        },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，持续掉血先打七五折。'],
    equip: ['{unitName} 装上 {equipmentName}，断线焦虑已被屏蔽。'],
  },
};

export default disconnectShell;
