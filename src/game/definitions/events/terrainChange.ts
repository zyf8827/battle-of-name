import type { GameEvent } from '../../types';

export const terrainChange: GameEvent = {
  id: 'terrainChange',
  name: '地形变化 🏞️',
  description:
    '战斗场地发生了变化，可能会出现森林、沙漠、或者沼泽，对战斗产生不同的影响。',
  hooks: {
    onTurnStart: (state) => {
      state.logEvent('地形发生了变化！');
      // Implement random terrain effects
    },
  },
};
