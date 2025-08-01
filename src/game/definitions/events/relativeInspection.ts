import type { GameEvent } from '../../types';

export const relativeInspection: GameEvent = {
  id: 'relativeInspection',
  name: '亲戚视察 👀',
  description: '你的亲戚突然来访，对你进行了一番“亲切”的问候，你的所有属性都下降了2点。',
  hooks: {
    onTurnStart: (state) => {
      const player = state.activePlayer;
      player.stats.attack = Math.max(0, player.stats.attack - 2);
      player.stats.defense = Math.max(0, player.stats.defense - 2);
      state.logEvent(`亲戚视察！${player.name} 的所有属性都下降了！`);
    },
  },
};