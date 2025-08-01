import type { Item } from '../../types';

export const bandAid: Item = {
  id: 'bandAid',
  name: '创可贴 🩹',
  description: '恢复少量生命值，并在接下来的3回合内每回合恢复5点生命值。',
  use: (self, state) => {
    const healAmount = 10;
    self.stats.hp = Math.min(self.stats.maxHp, self.stats.hp + healAmount);
    state.addStatusEffect(self, {
      id: 'regeneration',
      name: '再生',
      duration: 3,
      hooks: {
        onTurnEnd: (character, battleState) => {
          const regenAmount = 5;
          character.stats.hp = Math.min(character.stats.maxHp, character.stats.hp + regenAmount);
          battleState.logEvent(`${character.name} 恢复了 ${regenAmount} 点生命值。`);
        },
      },
    });
    state.logEvent(
      `${self.name} 使用了创可贴，恢复了 ${healAmount} 点生命值，并开始持续恢复。`,
    );
  },
};
