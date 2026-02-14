import type { EventPoolEntry } from '../../../engine/types';

const clientExit: EventPoolEntry = {
  id: 'event.client_exit',
  name: '甲方突然撤资 💸',
  weight: 2,
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
            const damage = Math.floor(owner.state.hp * 0.7);
            if (damage > 0) {
              engine.event.emitDirectDamage(owner, owner, damage, ['true_damage', 'env']);
            }
            // 触发一次后移除并添加后续减益
            engine.state.removeModifiersByMatcher(owner, (m) => m.id === 'debuff.client_exit_damage');
            engine.state.applyModifierEffect(owner, owner, {
              kind: 'APPLY_MODIFIER',
              modifier: {
                id: 'debuff.capital_winter',
                source: 'ENV',
                name: '资本寒冬 ❄️',
                description: '没钱没运气，活着就是奇迹',
                tags: ['debuff', 'env'],
                statBonus: { LUK: -15 },
                duration: 5,
              },
            });
          },
        },
      },
      textOverrides: {
        apply: '{targetName} 的资金链彻底断裂，规模瞬间萎缩了七成，陷入漫长的寒冬 📉',
      },
    },
  ],
  texts: {
    trigger: '甲方老板连夜注销了账号，顺便撤回了所有投资并拉黑了所有联系方式 💸',
  },
};

export default clientExit;
