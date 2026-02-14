import type { EquipmentLike } from '../base/equipment';

const cannotUndoSendKey: EquipmentLike = {
  id: 'equip.cannot_undo_send_key',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'EPIC',
  name: '不可撤回发送键 ⌨️',
  description: '按下去就没有回头路，只有附加伤害。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.cannot_undo_send_key', policy: 'IGNORE' },
  statBonus: { STR: 3 },
  triggers: [
    {
      trigger: {
        on: 'ON_HIT',
        when: {
          role: 'SOURCE',
          notHasTags: ['miss', 'true_damage', 'reflect'],
        },
      },
      effects: [
        {
          kind: 'DIRECT_DAMAGE',
          target: 'TARGET',
          value: 6,
          tags: ['true_damage', 'equip'],
        },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 捡到 {equipmentName}，发出去的每一下都不能撤回。'],
    equip: ['{unitName} 按下 {equipmentName}，附加伤害已进入发送队列。'],
  },
};

export default cannotUndoSendKey;
