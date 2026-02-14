import type { EventPoolEntry } from '../../../engine/types';

const pptCrash: EventPoolEntry = {
  id: 'event.ppt_crash',
  name: 'PPT崩溃 💥',
  weight: 5,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.ppt_disaster',
        source: 'ENV',
        name: '精神崩溃 💥',
        description: '心血付诸东流，灵魂当场宕机',
        tags: ['debuff', 'control', 'env'],
        statBonus: { STR: -10, AGI: -10 },
        duration: 2,
        hooks: {
          onTurnStart: ({ engine, owner }) => {
            const damage = Math.floor(owner.state.hp * 0.4);
            if (damage > 0) {
              engine.event.emitDirectDamage(owner, owner, damage, ['true_damage', 'env']);
            }
          },
        },
      },
      textOverrides: {
        apply: '{targetName} 看着漆黑的屏幕，感觉几年的心气瞬间散了，整个人陷入了僵直 🫠',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 辛辛苦苦做了一天的PPT在最后一次保存时彻底崩溃，文件直接变成了0字节！💻🔥',
  },
};

export default pptCrash;
