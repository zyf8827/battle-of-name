import type { EventPoolEntry } from '../../../engine/types';

const snackThief: EventPoolEntry = {
  id: 'event.snack_thief',
  name: '偷吃同事零食 🍪',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'buff.guilt_pleasure',
        source: 'ENV',
        name: '罪恶快感 🍪',
        description: '偷吃零食的快乐与内疚',
        tags: ['buff', 'env'],
        statBonus: { STR: 2, VIT: 1 },
        duration: 1,
      },
      textOverrides: {
        apply:
          '{targetName} 趁着同事去厕所，飞速伸出罪恶之手，体验了一把禁断的美味 🍪',
      },
    },
    {
      kind: 'GRANT_RANDOM_CONSUMABLE',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '隔壁桌的薯片袋子敞着口，散发出诱人的孜然香味 🍪',
  },
};

export default snackThief;
