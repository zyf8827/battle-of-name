import type { Item } from '../../types';

export const waterGun: Item = {
  id: 'waterGun',
  name: '水枪 🔫',
  description: '对敌人造成少量伤害，但可以连续使用两次。',
  use: (self, state) => {
    const damage = 8;
    state.opponent.stats.hp = Math.max(0, state.opponent.stats.hp - damage);
    state.logEvent(
      `${self.name} 用水枪攻击了 ${state.opponent.name}，造成了 ${damage} 点伤害。`,
    );
    // Add a status effect to allow a second use
    state.addStatusEffect(self, {
      id: 'water_gun_second_shot',
      name: '水枪二连击',
      duration: 1,
      hooks: {
        onTurnEnd: (character, battleState) => {
          // This hook will remove the effect after the turn
        },
      },
    });
  },
};
