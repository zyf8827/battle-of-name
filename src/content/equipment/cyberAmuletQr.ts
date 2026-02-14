import type { EquipmentLike } from '../base/equipment';

const cyberAmuletQr: EquipmentLike = {
  id: 'equip.cyber_amulet_qr',
  source: 'EQUIP',
  slot: 'ACCESSORY',
  rarity: 'RARE',
  name: '赛博平安符（二维码版） 📱',
  description: '扫码即开盾，电子祈福更高效。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.cyber_amulet_qr', policy: 'IGNORE' },
  statBonus: { VIT: 1, LUK: 2 },
  triggers: [
    {
      trigger: { on: 'ROUND_START' },
      effects: [{ kind: 'SHIELD', value: [{ type: 'FLAT', value: 4 }], tags: ['shield', 'equip'] }],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，扫码成功，护盾到账。'],
    equip: ['{unitName} 佩戴 {equipmentName}，开局先加一层平安盾。'],
  },
};

export default cyberAmuletQr;
