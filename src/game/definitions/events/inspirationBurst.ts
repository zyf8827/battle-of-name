import type { GameEvent } from '../../types';

export const inspirationBurst: GameEvent = {
  id: 'inspirationBurst',
  name: '灵感爆发 💡',
  description: '随机一个玩家的暴击率和暴击伤害大幅提升。',
  hooks: {
    onTurnStart: (state) => {
      const targetPlayer = state.checkProbability('inspirationBurst-target', 0.5) ? state.player1 : state.player2;
      state.addStatusEffect(targetPlayer, {
        id: 'inspiration_burst_buff',
        name: '灵感爆发',
        duration: 2,
        modifiers: {
          critRate: 0.2,
          critDmg: 0.5,
        },
      });
      state.logEvent(`灵感爆发！${targetPlayer.name} 的暴击率和暴击伤害大幅提升！`);
    },
  },
};