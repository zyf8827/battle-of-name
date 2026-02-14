import type { EventPoolEntry } from '../../../engine/types';

const stockCrash: EventPoolEntry = {
  id: 'event.stock_crash',
  name: '重仓股票腰斩 📉',
  weight: 4,
  effects: [
    {
      kind: 'APPLY_MODIFIER',
      target: 'SELF',
      modifier: {
        id: 'debuff.stock_misery',
        source: 'ENV',
        name: '倾家荡产 📉',
        description: '天台风很大，世界变成了绿色',
        tags: ['debuff', 'env'],
        statBonus: { STR: -15, VIT: -15, LUK: -15 },
        duration: 5,
        hooks: {
          onTurnStart: ({ engine, owner }) => {
            const damage = Math.floor(owner.state.hp * 0.3);
            if (damage > 0) {
              engine.event.emitDirectDamage(owner, owner, damage, ['true_damage', 'env']);
            }
            // 只在第一回合触发一次伤害后转换
            engine.state.removeModifiersByMatcher(owner, (m) => m.id === 'debuff.stock_misery');
            engine.state.applyModifierEffect(owner, owner, {
              kind: 'APPLY_MODIFIER',
              modifier: {
                id: 'debuff.stock_misery_trauma',
                source: 'ENV',
                name: '股市创伤 📉',
                description: '缓不过来，真的缓不过来',
                tags: ['debuff', 'env'],
                statBonus: { STR: -15, VIT: -15, LUK: -15 },
                duration: 4,
              },
            });
          },
        },
      },
      textOverrides: {
        apply: '{targetName} 看着绿油油的屏幕，感觉心脏漏跳了一拍，呼吸都在痛 📉',
      },
    },
  ],
  texts: {
    trigger: '{actorName} 打开了交易软件，发现持仓已经变成了负数，账户遭遇了毁灭性打击 📉',
  },
};

export default stockCrash;
