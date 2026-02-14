import type { EventPoolEntry } from '../../../engine/types';

const toiletBoss: EventPoolEntry = {
  id: 'event.toilet_boss',
  name: '公厕遇到老板 💩',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.toilet_social_death',
        source: 'ENV',
        name: '厕所社死 😱',
        description: '隔板间隙认出老板的皮鞋',
        tags: ['debuff', 'env'],
        statBonus: { STR: -4, LUK: -4 },
        duration: 2,
      },
      textOverrides: {
        apply: '{targetName} 在公厕隔间听到熟悉的声音 💀。',
      },
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '{actorName} 推开门，发现隔壁脚是老板的皮鞋... 💩',
  },
};

export default toiletBoss;
