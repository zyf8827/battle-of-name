import type { EventPoolEntry } from '../../../engine/types';

const cleanerFind: EventPoolEntry = {
  id: 'event.cleaner_find',
  name: '保洁阿姨捡到装备 🧹',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.auntie_blessing',
        source: 'ENV',
        name: '阿姨祝福 🧹',
        description: '保洁阿姨帮忙找回失物',
        tags: ['buff', 'env'],
        statBonus: { AGI: 2, LUK: 2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 拿回了亮洁如新的装备，甚至还被塞了一块奶糖 🍬',
      },
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '保洁阿姨在清理沙发缝隙时，掏出了一个闪闪发光的东西 🧹',
  },
};

export default cleanerFind;
