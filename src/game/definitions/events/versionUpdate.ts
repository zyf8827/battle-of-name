import type { GameEvent } from '../../types';

export const versionUpdate: GameEvent = {
  id: 'versionUpdate',
  name: '版本更新 ✅',
  description: '游戏版本更新，修复了一些BUG，所有人的负面状态都被清除了。',
  hooks: {
    onTurnStart: (state) => {
      state.player1.statusEffects = state.player1.statusEffects.filter(effect => {
        return !['stunned', 'poisoned', 'mining_virus', 'voice_changer_effect', 'hungry', 'attack_down', 'glued', 'auditory_inversion_debuff', 'language_confusion_debuff', 'magnetic_field_debuff', 'olfactory_inversion_debuff', 'action_failure'].includes(effect.id);
      });
      state.player2.statusEffects = state.player2.statusEffects.filter(effect => {
        return !['stunned', 'poisoned', 'mining_virus', 'voice_changer_effect', 'hungry', 'attack_down', 'glued', 'auditory_inversion_debuff', 'language_confusion_debuff', 'magnetic_field_debuff', 'olfactory_inversion_debuff', 'action_failure'].includes(effect.id);
      });
      state.logEvent('版本更新，所有人的负面状态都已被清除！');
    },
  },
};
