import type { GameEvent } from '../../types';

export const inspiration: GameEvent = {
  id: 'inspiration',
  name: '灵感迸发 💡',
  description: '突然有了绝妙的子，下一次攻击的暴击率和暴击伤害都大幅提升。',
  hooks: {
    onTurnStart: (state) => {
      const player = state.activePlayer;
      state.addStatusEffect(player, {
        id: 'inspiration_buff',
        name: '灵感迸发',
        duration: 1,
        modifiers: {
          critRate: 0.5,
          critDmg: 0.5,
        },
      });
      state.logEvent(`灵感迸发！${player.name} 的下一次攻击将造成巨大伤害！`);
    },
  },
};