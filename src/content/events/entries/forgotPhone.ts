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
        apply: '{targetName} 瞳孔地震，仿佛失去了与宇宙的所有联系 📉',
      },
    },
  ],
  texts: {
    trigger: '手下意识地往口袋里一插，却摸到了一片虚无 📱',
  },
};

export default forgotPhone;
