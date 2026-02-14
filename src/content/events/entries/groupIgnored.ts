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
        apply: '{targetName} 疯狂刷新页面，确认了自己确实是被全员无视了 ❄️',
      },
    },
  ],
  texts: {
    trigger: '在大群里发出的疑问石沉大海，只有屏幕冷冰冰的光 💬',
  },
};

export default groupIgnored;
