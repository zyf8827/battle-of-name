import type { EventPoolEntry } from '../../../engine/types';

const forgotPhone: EventPoolEntry = {
  id: 'event.forgot_phone',
  name: '出门忘带手机 📱',
  weight: 8,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.nomophobia',
        source: 'ENV',
        name: '手机焦虑 🔋',
        description: '感觉身体被掏空',
        tags: ['debuff', 'env'],
        statBonus: { STR: -2, AGI: -2, VIT: -2, LUK: -5 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 摸了摸口袋，发现手机没了！全属性大幅下降 📉！',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 走到楼下才发现没带手机，现代人的末日降临了 🔌。',
  },

};

export default forgotPhone;
