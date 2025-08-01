import type { GameEvent } from '../../types';

export const unluckyStar: GameEvent = {
  id: 'unluckyStar',
  name: '厄运星 🌑',
  description: '随机一个玩家获得一个强力减益效果。',
  hooks: {
    onTurnStart: (state) => {
      const targetPlayer = state.checkProbability('unluckyStar-target', 0.5) ? state.player1 : state.player2;
      const effectType = Math.floor(state.rng() * 3); // 0: atk, 1: def, 2: speed
      let effectId: string;
      let effectName: string;
      let modifier: { atk?: number; def?: number; speed?: number; };

      switch (effectType) {
        case 0:
          effectId = 'unlucky_star_atk';
          effectName = '厄运攻击';
          modifier = { atk: -10 };
          break;
        case 1:
          effectId = 'unlucky_star_def';
          effectName = '厄运防御';
          modifier = { def: -10 };
          break;
        case 2:
          effectId = 'unlucky_star_speed';
          effectName = '厄运速度';
          modifier = { speed: -10 };
          break;
        default:
          effectId = 'unlucky_star_atk';
          effectName = '厄运攻击';
          modifier = { atk: -10 };
      }

      state.addStatusEffect(targetPlayer, {
        id: effectId,
        name: effectName,
        duration: 2,
        modifiers: modifier,
      });
      state.logEvent(`厄运星降临！${targetPlayer.name} 获得了 “${effectName}” 效果！`);
    },
  },
};