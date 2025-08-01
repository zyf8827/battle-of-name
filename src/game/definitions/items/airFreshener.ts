import type { Item } from '../../types';

export const airFreshener: Item = {
  id: 'airFreshener',
  name: '空气清新剂 🌬️',
  description: '清除战场上所有的负面状态。',
  use: (self, state) => {
    // Clear all negative status effects
    self.statusEffects = self.statusEffects.filter(effect => {
      // Define what constitutes a "negative" status effect
      // For simplicity, let's assume 'stunned', 'poisoned', 'mining_virus', 'voice_changer_effect' are negative
      return !['stunned', 'poisoned', 'mining_virus', 'voice_changer_effect'].includes(effect.id);
    });
    state.opponent.statusEffects = state.opponent.statusEffects.filter(effect => {
      return !['stunned', 'poisoned', 'mining_virus', 'voice_changer_effect'].includes(effect.id);
    });
    state.logEvent(`${self.name} 使用了空气清新剂，清除了所有的负面状态。`);
  },
};
