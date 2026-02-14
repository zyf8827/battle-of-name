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
        apply:
          '{targetName} 看着满屏点赞，虽然腿快断了，但虚荣心得到了极大的满足 👑',
      },
    },
  ],
  texts: {
    trigger: '系统推送响起：您今日步数已达三万，成功占领了封面 👟',
  },
};

export default wechatSport;
