import type { GameEvent, CharacterStats } from '../../types';

export const dataCorruption: GameEvent = {
  id: 'dataCorruption',
  name: '数据损坏 💾',
  description: '随机一个玩家的随机一项属性暂时大幅下降。',
  hooks: {
    onTurnStart: (state) => {
      const targetPlayer = state.checkProbability('dataCorruption-target', 0.5) ? state.player1 : state.player2;
      const stats: (keyof CharacterStats)[] = ['attack', 'defense', 'speed'];
      const randomStat = stats[Math.floor(state.rng() * stats.length)];
      const amount = Math.floor(state.rng() * 10) + 5; // 5-15点

      state.addStatusEffect(targetPlayer, {
        id: 'data_corruption_debuff',
        name: '数据损坏',
        duration: 2,
        modifiers: {
          [randomStat === 'attack' ? 'atk' : randomStat === 'defense' ? 'def' : 'speed']: -amount,
        },
      });
      state.logEvent(`数据损坏！${targetPlayer.name} 的 ${randomStat} 暂时下降了 ${amount} 点！`);
    },
  },
};