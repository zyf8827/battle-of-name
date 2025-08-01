import type { GameEvent } from '../../types';

export const randomTeleport: GameEvent = {
  id: 'randomTeleport',
  name: '随机传送 🌀',
  description: '你和你的对手被随机传送到了一个新的位置，你们之间的距离发生了变化。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('随机传送！');
      // This would require a distance mechanic
    },
  },
};
