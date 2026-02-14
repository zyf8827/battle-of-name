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
        apply: '{targetName} 抠脚的动作瞬间凝固，全世界都看到了那件粉色睡衣 😳',
      },
    },
  ],
  texts: {
    trigger: '会议进行到一半，后台突然自动开启了全员视频模式 📹',
  },
};

export default cameraAccident;
