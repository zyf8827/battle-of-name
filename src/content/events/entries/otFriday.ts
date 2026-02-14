import type { EventPoolEntry } from '../../../engine/types';

const otFriday: EventPoolEntry = {
  id: 'event.ot_friday',
  name: '周五被点名加班 📅',
  weight: 12,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.friday_ot_heartbreak',
        source: 'ENV',
        name: '周五加班症 💔',
        description: '原本计划全泡汤',
        tags: ['debuff', 'env'],
        statBonus: { VIT: -3, AGI: -2 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 看着已经定好的电影票，留下了打工人屈辱的泪水 💔',
      },
    },
  ],
  texts: {
    trigger: '就在关机键即将按下的那一刻，老板的手稳稳搭在了肩上 📅',
  },
};

export default otFriday;
