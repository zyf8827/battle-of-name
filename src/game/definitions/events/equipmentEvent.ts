import type { GameEvent } from '../../types';
import { allEquipments } from '../equipment';

export const equipmentEvent: GameEvent = {
  id: 'equipmentEvent',
  name: '天降猛男 💪',
  description: '一位神秘的猛男出现在你面前，送给了你一件装备。',
  hooks: {
    onTurnStart: (state) => {
      const { activePlayer, rng } = state;
      const randomEquipment = allEquipments[Math.floor(rng() * allEquipments.length)];
      activePlayer.equipment[randomEquipment.type] = randomEquipment;
      state.logEvent(
        `${activePlayer.name} 获得了装备【${randomEquipment.name}】！`,
      );
    },
  },
};
