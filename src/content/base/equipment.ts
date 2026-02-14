import type { Modifier } from '../../engine/types';
import type { TextTemplate } from './text';

export const DEFAULT_EQUIPMENT_WEIGHT = 1;

export type EquipmentLike = Modifier & {
  source: 'EQUIP';
  slot: 'WEAPON' | 'ARMOR' | 'ACCESSORY';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  weight?: number;
  texts?: {
    pickup?: TextTemplate;
    equip?: TextTemplate;
  };
};
