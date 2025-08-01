import type { GameEvent } from '../../types';

export const bossApproval: GameEvent = {
  id: 'bossApproval',
  name: '大佬点赞 👍',
  description: '你的表现得到了大佬的认可，所有属性临时提升5点。',
  hooks: {
    onTurnStart: (state) => {
      const player = state.activePlayer;
      player.stats.attack += 5;
      player.stats.defense += 5;
      state.logEvent(`大佬点赞！${player.name} 的所有属性都提升了！`);
    },
  },
};
