import type { EventPoolEntry } from '../../../engine/types';

const wechatSport: EventPoolEntry = {
  id: 'event.wechat_sport',
  name: '微信运动排第一 👟',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.sport_vanity',
        source: 'ENV',
        name: '运动榜首 👑',
        description: '今天走得最多',
        tags: ['buff', 'env'],
        statBonus: { STR: 2, VIT: 2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 占领了微信运动封面 🏆',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 打开微信运动，发现自己占领了封面 👟',
  },
};

export default wechatSport;
