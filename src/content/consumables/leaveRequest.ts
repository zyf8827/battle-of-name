import type { Consumable } from '../base/consumable';
import type { Modifier } from '../../engine/types';

const onLeave: Modifier = {
  id: 'consumable.leave_request.on_leave',
  source: 'BUFF',
  name: '休假中 🏖️',
  description: '请勿打扰。免疫所有伤害。',
  duration: 1,
  tags: ['buff', 'immune'],
  triggers: [
    {
      trigger: { on: 'PIPELINE_INCOMING', when: { role: 'TARGET' } },
      effects: [{ kind: 'MITIGATE', when: { role: 'TARGET' }, multiplier: 0 }],
    },
  ],
  texts: {
    trigger: ['{targetName} 处于休假状态，自动回复：“收不到消息”。'],
  },
};

const leaveRequest: Consumable = {
  id: 'consumable.leave_request',
  name: '请假条 📝',
  description: '只要胆子大，天天寒暑假。免疫所有伤害一回合。',
  effects: [{ kind: 'APPLY_MODIFIER', target: 'SELF', modifier: onLeave }],
  texts: {
    use: ['{unitName} 拍出一张 {itemName}，直接溜了！🏃💨'],
  },
};

export default leaveRequest;
