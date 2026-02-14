import type { EquipmentLike } from '../base/equipment';

const goodLuckReadReceipt: EquipmentLike = {
  id: 'equip.good_luck_read_receipt',
  source: 'EQUIP',
  slot: 'ACCESSORY',
  rarity: 'EPIC',
  name: '好运已读回执 ✅',
  description: '每回合自动提醒宇宙：该给我点好运了。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.good_luck_read_receipt', policy: 'IGNORE' },
  statBonus: { LUK: 4 },
  triggers: [
    {
      trigger: { on: 'ROUND_START' },
      effects: [{ kind: 'TRIGGER_EVENT_POOL', poolId: 'pool.turn.personal' }],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，系统提示：好运已读。'],
    equip: ['{unitName} 佩戴 {equipmentName}，本回合事件抽取积极响应。'],
  },
};

export default goodLuckReadReceipt;
