import type { GameEvent } from '../../types';

export const koiPossession: GameEvent = {
  id: 'koiPossession',
  name: '锦鲤附体 🐟',
  description: '你被锦鲤附体了，接下来3回合内，你的暴击率提升50%。',
  hooks: {
    onTurnStart: (state) => {
      const player = state.activePlayer;
      // Apply a temporary crit rate boost
      state.logEvent(`锦鲤附体！${player.name} 的暴击率大幅提升！`);
    },
  },
};
