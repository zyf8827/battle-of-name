import type { GameEvent, CharacterStats } from '../../types';

export const goodFortune: GameEvent = {
  id: 'goodFortune',
  name: '喜从天降 😊',
  description: '天上掉下了一块馅饼，当前玩家的随机一项属性永久提升5点。',
  hooks: {
    onTurnStart: (state) => {
      const player = state.activePlayer;
      const stats: (keyof CharacterStats)[] = ['maxHp', 'attack', 'defense'];
      const randomStat = stats[Math.floor(state.rng() * stats.length)];
      player.stats[randomStat] += 5;
      state.logEvent(`喜从天降！${player.name} 的 ${randomStat} 永久提升了！`);
    },
  },
};