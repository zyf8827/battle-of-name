import type { GameEvent } from '../../types';

export const luckyStar: GameEvent = {
  id: 'luckyStar',
  name: '幸运星 ✨',
  description: '随机一个玩家获得一个强力增益效果。',
  hooks: {
    onTurnStart: (state) => {
      const targetPlayer = state.checkProbability('luckyStar-target', 0.5) ? state.player1 : state.player2;
      const effectType = Math.floor(state.rng() * 3); // 0: atk, 1: def, 2: speed
      let effectId: string;
      let effectName: string;
      let modifier: { atk?: number; def?: number; speed?: number; };

      switch (effectType) {
        case 0:
          effectId = 'lucky_star_atk';
          effectName = '幸运攻击';
          modifier = { atk: 10 };
          break;
        case 1:
          effectId = 'lucky_star_def';
          effectName = '幸运防御';
          modifier = { def: 10 };
          break;
        case 2:
          effectId = 'lucky_star_speed';
          effectName = '幸运速度';
          modifier = { speed: 10 };
          break;
        default:
          effectId = 'lucky_star_atk';
          effectName = '幸运攻击';
          modifier = { atk: 10 };
      }

      state.addStatusEffect(targetPlayer, {
        id: effectId,
        name: effectName,
        duration: 2,
        modifiers: modifier,
      });
      state.logEvent(`幸运星降临！${targetPlayer.name} 获得了 “${effectName}” 效果！`);
    },
  },
};