import type { GameEvent } from '../../types';

export const glitch: GameEvent = {
  id: 'glitch',
  name: '程序故障 🐛',
  description: '随机一个玩家的攻击有几率对自身造成伤害。',
  hooks: {
    onTurnStart: (state) => {
      const targetPlayer = state.checkProbability('glitch-target', 0.5) ? state.player1 : state.player2;
      state.addStatusEffect(targetPlayer, {
        id: 'glitch_effect',
        name: '程序故障',
        duration: 2,
        hooks: {
          onBeforeAttack: (self, target, battleState) => {
            if (battleState.checkProbability('glitch-selfDamage', 0.2)) {
              const damage = Math.floor(self.stats.attack * 0.2); // 造成攻击力20%的伤害
              self.stats.hp = Math.max(0, self.stats.hp - damage);
              battleState.logEvent(`${self.name} 的攻击因为程序故障而对自身造成了 ${damage} 点伤害！`);
            }
          },
        },
      });
      state.logEvent(`程序故障！${targetPlayer.name} 的攻击有几率对自身造成伤害！`);
    },
  },
};