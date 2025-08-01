import type { GameEvent } from '../../types';

export const serverOverload: GameEvent = {
  id: 'serverOverload',
  name: '服务器过载 💥',
  description: '双方每回合损失少量生命值。',
  hooks: {
    onTurnStart: (state) => {
      state.addStatusEffect(state.player1, {
        id: 'server_overload_debuff',
        name: '服务器过载',
        duration: 3,
        hooks: {
          onTurnEnd: (character, battleState) => {
            const damage = 2;
            character.stats.hp = Math.max(0, character.stats.hp - damage);
            battleState.logEvent(`${character.name} 受到服务器过载伤害 ${damage} 点！`);
          },
        },
      });
      state.addStatusEffect(state.player2, {
        id: 'server_overload_debuff',
        name: '服务器过载',
        duration: 3,
        hooks: {
          onTurnEnd: (character, battleState) => {
            const damage = 2;
            character.stats.hp = Math.max(0, character.stats.hp - damage);
            battleState.logEvent(`${character.name} 受到服务器过载伤害 ${damage} 点！`);
          },
        },
      });
      state.logEvent('服务器过载！双方每回合损失少量生命值！');
    },
  },
};