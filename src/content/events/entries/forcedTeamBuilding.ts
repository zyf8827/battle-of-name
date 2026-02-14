import type { EventPoolEntry } from '../../../engine/types';

const forcedTeamBuilding: EventPoolEntry = {
  id: 'event.forced_team_building',
  name: '被迫团建 🚌',
  weight: 10,
  effects: [
    {
      kind: 'DIRECT_DAMAGE',
      target: 'SELF',
      value: 10,
      tags: ['env', 'true_damage'],
    },
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.social_exhaustion',
        source: 'ENV',
        name: '社交耗尽 😫',
        description: '尴尬的破冰游戏耗尽了能量',
        tags: ['debuff', 'env'],
        statBonus: { VIT: -2 },
        duration: 2,
      },
    },
  ],
  texts: {
    trigger: '{actorName} 被拉去周末团建，身心俱疲 🏕️。',
  },
};

export default forcedTeamBuilding;
