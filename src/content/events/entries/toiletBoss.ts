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
        apply:
          '{targetName} 盯着那双昂贵的皮鞋，瞬间连大气都不敢喘，感觉心脏都要停跳了 😱',
      },
    },
    {
      kind: 'GRANT_RANDOM_EQUIPMENT',
      target: 'SELF',
    },
  ],
  texts: {
    trigger: '正在享受带薪拉屎的静谧时光，隔壁隔间传来了熟悉的低沉咳嗽声 💩',
  },
};

export default toiletBoss;
