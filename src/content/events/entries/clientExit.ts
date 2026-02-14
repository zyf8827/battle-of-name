import type { EventPoolEntry } from '../../../engine/types';

const clientExit: EventPoolEntry = {
  id: 'event.client_exit',
  name: '甲方突然撤资 💸',
  weight: 3,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.client_exit_damage',
        source: 'ENV',
        name: '破产危机 💸',
        tags: ['debuff', 'env'],
        duration: 1,
        hooks: {
          onTurnStart: ({ engine, owner }) => {
            const damage = Math.floor(owner.state.hp * 0.5);
            if (damage > 0) {
              engine.event.emitDirectDamage(owner, owner, damage, ['true_damage', 'env']);
            }
            // 触发一次后移除
            engine.state.removeModifiersByMatcher(owner, (m) => m.id === 'debuff.client_exit_damage');
          },
        },
      },
      textOverrides: {
        apply: '{targetName} 的资金链彻底断裂，规模瞬间萎缩一半 📉',
      },
    },
  ],
  texts: {
    trigger: '甲方老板连夜注销了账号，顺便撤回了所有投资 💸',
  },
};

export default clientExit;
