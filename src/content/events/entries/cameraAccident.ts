import type { EventPoolEntry } from '../../../engine/types';

const cameraAccident: EventPoolEntry = {
  id: 'event.camera_accident',
  name: '摄像头没关 📹',
  weight: 6,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.social_death',
        source: 'ENV',
        name: '社死现场 😳',
        description: '穿着睡衣开了全员会',
        tags: ['debuff', 'env'],
        statBonus: { VIT: -4 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 发现视频会议没关摄像头，全公司都看见了ta的粉色睡衣 👙。',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 穿着睡衣抠着脚，突然发现会议摄像头是开着的！😱',
  },

};

export default cameraAccident;
