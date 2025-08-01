import type { GameEvent } from '../../types';

export const systemCrash: GameEvent = {
  id: 'systemCrash',
  name: '系统崩溃 💥',
  description: '随机一个玩家每回合损失当前生命值的一定百分比。',
  hooks: {
    onTurnStart: (state) => {
      const targetPlayer = state.checkProbability('systemCrash-target', 0.5) ? state.player1 : state.player2;
      const damagePercentage = state.checkProbability('systemCrash-damage', 0.5) ? 0.1 : 0.2; // 10% or 20%

      state.addStatusEffect(targetPlayer, {
        id: 'system_crash_debuff',
        name: '系统崩溃',
        duration: 3,
        hooks: {
          onTurnEnd: (character, battleState) => {
            const damage = Math.floor(character.stats.hp * damagePercentage);
            character.stats.hp = Math.max(0, character.stats.hp - damage);
            battleState.logEvent(`${character.name} 受到系统崩溃伤害 ${damage} 点！`);
          },
        },
      });
      state.logEvent(`系统崩溃！${targetPlayer.name} 每回合损失生命值！`);
    },
  },
};