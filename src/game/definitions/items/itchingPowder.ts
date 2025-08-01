import type { Item } from '../../types';

export const itchingPowder: Item = {
  id: 'itchingPowder',
  name: '痒痒粉 ✨',
  description: '使敌人在接下来的3回合内，每回合损失5点生命值。',
  use: (self, state) => {
    state.addStatusEffect(state.opponent, {
      id: 'itching',
      name: '瘙痒',
      duration: 3,
      hooks: {
        onTurnEnd: (character, battleState) => {
          const damage = 5;
          character.stats.hp = Math.max(0, character.stats.hp - damage);
          battleState.logEvent(`${character.name} 感到瘙痒，损失了 ${damage} 点生命值！`);
        },
      },
    });
    state.logEvent(`${self.name} 撒了痒痒粉，${state.opponent.name} 感觉浑身难受。`);
  },
};
