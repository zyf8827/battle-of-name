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
        apply: '{targetName} 的摄像头一直开着...全班都看见了 📹',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 网课结束，发现摄像头开了一整节课 📹',
  },
};

export default cameraOn;
