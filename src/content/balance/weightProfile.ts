export type BalanceWeightProfile = {
  initialEquipmentSlotChance: {
    WEAPON: number;
    ARMOR: number;
    ACCESSORY: number;
  };
  equipmentWeights: Partial<Record<string, number>>;
  equipmentFallbackChance: number;
  initialConsumableChance: number;
  consumableWeights: Partial<Record<string, number>>;
  eventWeights: Partial<Record<string, number>>;
  scheduleChanceMultiplier: Partial<Record<string, number>>;
};

export const CURRENT_WEIGHT_PROFILE: BalanceWeightProfile = {
  initialEquipmentSlotChance: {
    WEAPON: 0.62,
    ARMOR: 0.58,
    ACCESSORY: 0.54,
  },
  equipmentWeights: {
    'equip.keyboard': 0.86,
    'equip.thorns': 0.9,
    'equip.cannot_undo_send_key': 0.9,
    'equip.read_ignore_boomerang': 0.92,
    'equip.reverse_chicken_soup_speaker': 0.92,
    'equip.emotional_value_generator': 0.9,
    'equip.anti_cringe_field_coat': 0.92,
    'equip.voice_to_text_machine': 0.95,
    'equip.carbon_life_patch': 0.95,
    'equip.mystic_badge': 1.18,
    'equip.blame_catapult': 1.12,
    'equip.disconnect_shell': 1.08,
    'equip.moyu_permit': 1.06,
    'equip.social_phobia_mic': 1.04,
  },
  equipmentFallbackChance: 0.3,
  initialConsumableChance: 0.3,
  consumableWeights: {
    'consumable.filler_item': 0.85,
    'consumable.page_404': 0.92,
    'consumable.adrenaline_shot': 1.02,
    'consumable.regret_pill': 0.94,
    'consumable.fidget_spinner': 0.9,
    'consumable.lego': 0.95,
    'consumable.lemon': 0.95,
    'consumable.money_power': 0.95,
    'consumable.syrup': 1.12,
    'consumable.hair_tonic': 1.12,
    'consumable.brick': 1.06,
    'consumable.leave_request': 1.06,
  },
  eventWeights: {
    'event.elevator_fart': 1.05,
    'event.moment_like': 1.05,
    'event.toilet_boss': 1.05,
    'event.cold_shower': 1.05,
    // 新增装备相关事件
    'event.express_delivery': 1.15,
    'event.colleague_gift': 1.12,
    'event.cleaner_find': 1.1,
    'event.asset_check': 0.95,
    'event.desk_organize': 1.08,
    // 新增物品相关事件
    'event.snack_thief': 1.1,
    'event.afternoon_tea': 1.12,
    'event.expired_item': 0.9,
    'event.vending_machine': 1.15,
    'event.fridge_sharing': 1.08,
  },
  scheduleChanceMultiplier: {
    'pool.round.global@RoundStart': 0.95,
    'pool.turn.personal@TurnStart': 1,
  },
};

export function resolveWeight(weights: Partial<Record<string, number>>, id: string): number {
  const value = weights[id];
  if (typeof value !== 'number' || !Number.isFinite(value)) return 1;
  return Math.min(3, Math.max(0.2, value));
}
