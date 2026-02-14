import type { EventPoolEntry } from '../../../engine/types';

const cameraOn: EventPoolEntry = {
  id: 'event.camera_on',
  name: '网课忘记关摄像头 📹',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.camera_public_execution',
        source: 'ENV',
        name: '公开处刑 ⚖️',
        description: '直播间全看见了',
        tags: ['debuff', 'env'],
        statBonus: { LUK: -5, STR: -3 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 意识到全班都看完了ta这节课的各种自拍表演 😱',
      },
    },
  ],
  texts: {
    trigger: '下课铃响了，屏幕角落的红点却依然亮着 📹',
  },
};

export default cameraOn;
