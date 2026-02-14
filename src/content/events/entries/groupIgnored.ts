import type { EventPoolEntry } from '../../../engine/types';

const groupIgnored: EventPoolEntry = {
  id: 'event.group_ignored',
  name: '群里说话没人理 💬',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.group_cold',
        source: 'ENV',
        name: '冷场尴尬 ❄️',
        description: '说的话被无视了',
        tags: ['debuff', 'env'],
        statBonus: { LUK: -2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 在群里说话，就像空气一样 💬',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 在群里发了条消息，一个小时没人回 💬',
  },
};

export default groupIgnored;
