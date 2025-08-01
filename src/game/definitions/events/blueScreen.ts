import type { GameEvent, CharacterStats } from '../../types';

export const blueScreen: GameEvent = {
  id: 'blueScreen',
  name: '电脑蓝屏 💻',
  description: '你的电脑突然蓝屏了，你损失了当前回合，并且随机一项属性永久下降2点。',
  hooks: {
    onTurnStart: (state) => {
      const player = state.activePlayer;
      const stats: (keyof CharacterStats)[] = ['maxHp', 'attack', 'defense'];
      const randomStat = stats[Math.floor(state.rng() * stats.length)];
      player.stats[randomStat] = Math.max(0, player.stats[randomStat] - 2);
      state.addStatusEffect(player, {
        id: 'stunned',
        name: '眩晕',
        duration: 1,
      });
      state.logEvent(`电脑蓝屏！${player.name} 的 ${randomStat} 永久下降了！`);
    },
  },
};