import type { EventPoolEntry } from '../../../engine/types';

const queueJump: EventPoolEntry = {
  id: 'event.queue_jump',
  name: '超市插队 🛒',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.no_shame',
        source: 'ENV',
        name: '厚脸皮 👺',
        description: '只要我不尴尬，尴尬的就是别人',
        tags: ['buff', 'env'],
        statBonus: { AGI: 3 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 强行插队成功，虽然被骂，但快了。 🏃',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 在超市收银台发动技能：我赶时间！🕐',
  },

};

export default queueJump;
