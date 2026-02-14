import type { EquipmentLike } from '../base/equipment';

const moyuPermit: EquipmentLike = {
  id: 'equip.moyu_permit',
  source: 'EQUIP',
  slot: 'WEAPON',
  rarity: 'EPIC',
  name: '摸鱼合法化批文 📜',
  description: '一纸在手，随机事件也得给你让路。',
  priority: 0,
  tags: ['equip'],
  stacking: { stackKey: 'equip.moyu_permit', policy: 'IGNORE' },
  statBonus: { LUK: 3 },
  triggers: [
    {
      trigger: { on: 'TURN_START' },
      effects: [
        { kind: 'TRIGGER_EVENT_POOL', poolId: 'pool.turn.personal' },
        {
          kind: 'SHIELD',
          value: [{ type: 'FLAT', value: 3 }],
          tags: ['shield', 'equip'],
        },
      ],
    },
  ],
  texts: {
    pickup: ['{unitName} 拿到 {equipmentName}，正式进入编制外快乐模式 😌。'],
    equip: ['{unitName} 展开 {equipmentName}，本回合由“运气法”解释一切。'],
  },
};

export default moyuPermit;
