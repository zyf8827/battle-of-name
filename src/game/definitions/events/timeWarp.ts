import type { GameEvent } from '../../types';

export const timeWarp: GameEvent = {
  id: 'timeWarp',
  name: '时间扭曲 ⏳',
  description: '随机一个玩家获得额外行动机会或失去行动机会。',
  hooks: {
    onTurnStart: (state) => {
      const targetPlayer = state.checkProbability('timeWarp-target', 0.5) ? state.player1 : state.player2;
      if (state.checkProbability('timeWarp-effect', 0.5)) {
        state.addStatusEffect(targetPlayer, {
          id: 'extra_turn',
          name: '额外行动',
          duration: 1,
        });
        state.logEvent(`时间扭曲！${targetPlayer.name} 获得了额外行动机会！`);
      } else {
        state.addStatusEffect(targetPlayer, {
          id: 'lose_turn',
          name: '失去行动',
          duration: 1,
        });
        state.logEvent(`时间扭曲！${targetPlayer.name} 失去了行动机会！`);
      }
    },
  },
};