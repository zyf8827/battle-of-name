import type { GameEvent } from '../../types';

export const phoneOutOfBattery: GameEvent = {
  id: 'phoneOutOfBattery',
  name: '手机没电 📱',
  description: '你的手机没电了，你感到非常焦虑，防御力下降5点。',
  hooks: {
    onTurnStart: (state) => {
      const player = state.activePlayer;
      player.stats.defense = Math.max(0, player.stats.defense - 5);
      state.logEvent(`手机没电！${player.name} 的防御力下降了！`);
    },
  },
};
