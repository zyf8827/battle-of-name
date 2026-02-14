import type { EventPoolEntry } from '../../../engine/types';

const trafficJam: EventPoolEntry = {
  id: 'event.traffic_jam',
  name: '全城堵车 🚗',
  weight: 8,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'ALL',
      modifier: {
        id: 'debuff.traffic_jam',
        source: 'ENV',
        name: '路怒症 🤬',
        description: '全城交通瘫痪，心情极度烦躁',
        tags: ['debuff', 'env'],
        statBonus: { AGI: -2 },
        duration: 1,
      },
      textOverrides: {
        apply: '{targetName} 看着不断跳动的计价器和纹丝不动的窗外，心态彻底爆炸 🤬',
      },
    },
  ],
  texts: {
    trigger: '一眼望不到头的红尾灯照亮了清晨，整条马路彻底瘫痪了 🚗',
  },
};

export default trafficJam;
