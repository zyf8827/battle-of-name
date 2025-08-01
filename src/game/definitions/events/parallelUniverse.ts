import type { GameEvent } from '../../types';

export const parallelUniverse: GameEvent = {
  id: 'parallelUniverse',
  name: '平行宇宙 🌌',
  description: '你进入了一个平行宇宙，你和你的对手的职业互换了。',
  hooks: {
    onTurnStart: (state) => {
      const tempCareer = state.player1.career;
      state.player1.career = state.player2.career;
      state.player2.career = tempCareer;
      state.logEvent('你进入了一个平行宇宙，双方职业互换！');
    },
  },
};
