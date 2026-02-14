import type { EventPoolEntry } from '../../../engine/types';

const snackParty: EventPoolEntry = {
  id: 'event.snack_party',
  name: '公司零食大放送 🍬',
  weight: 10,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'buff.snack_happy',
        source: 'ENV',
        name: '零食自由 🍬',
        description: '公司零食柜大放送',
        tags: ['buff', 'env'],
        statBonus: { VIT: 2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 吃到公司免费零食 🍬',
      },
    },
    {
      kind: 'GRANT_RANDOM_CONSUMABLE',
      target: 'ALL',
    },
  ],
  texts: {
    trigger: '公司零食柜清仓大放送，全员开吃 🍬',
  },
};

export default snackParty;
