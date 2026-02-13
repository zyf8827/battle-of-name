import type { Modifier } from '../../engine/types';
import type { TextTemplate } from './text';

export type EquipmentLike = Modifier & {
  source: 'EQUIP';
  slot: 'WEAPON' | 'ARMOR' | 'ACCESSORY';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  texts?: {
    pickup?: TextTemplate;
    equip?: TextTemplate;
  };
};
