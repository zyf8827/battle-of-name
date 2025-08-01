import type { GameEvent, CharacterStats } from '../../types';

export const attributeSwap: GameEvent = {
  id: 'attributeSwap',
  name: '属性交换 🔄',
  description: '你和你的对手的随机一项属性交换了。',
  hooks: {
    onTurnStart: (state) => {
      const stats: (keyof CharacterStats)[] = ['attack', 'defense'];
      const randomStat = stats[Math.floor(state.rng() * stats.length)];
      const tempStat = state.player1.stats[randomStat];
      state.player1.stats[randomStat] = state.player2.stats[randomStat];
      state.player2.stats[randomStat] = tempStat;
      state.logEvent(`属性交换！双方的 ${randomStat} 交换了！`);
    },
  },
};
