import type { EventPoolEntry } from '../../../engine/types';

const deskOrganize: EventPoolEntry = {
  id: 'event.desk_organize',
  name: '整理工位发现装备 🗂️',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.tidy_mind',
        source: 'ENV',
        name: '整洁心境 ✨',
        description: '整理工位后的清爽',
        tags: ['buff', 'env'],
        statBonus: { VIT: 2, LUK: 2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 擦掉污垢，发现这居然是一件失踪已久的神器 ✨',
      },
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '在清理积满灰尘的工位角落时，一个发光的小玩意露了出来 🗂️',
  },
};

export default deskOrganize;
