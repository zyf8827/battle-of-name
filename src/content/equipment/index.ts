import type { Modifier } from '../../engine/types';
import { deepCloneKeepFns } from '../../engine/clone';

import type { EquipmentLike } from '../base/equipment';

import keyboard from './keyboard';
import thorns from './thorns';

export const equipments: EquipmentLike[] = [keyboard, thorns];
export const equipmentIds: string[] = equipments.map((item) => item.id);
const equipmentCatalog: Record<string, EquipmentLike> = Object.fromEntries(
  equipments.map((item) => [item.id, item]),
);

export function cloneEquipment(id: string): Modifier {
  const found = equipmentCatalog[id];
  if (!found) {
    throw new Error(`Unknown equipment: ${id}`);
  }
  return deepCloneKeepFns(found);
}

export function hasEquipment(id: string): boolean {
  return equipmentIds.includes(id);
}

export function getEquipmentById(id: string): EquipmentLike | undefined {
  return equipmentCatalog[id];
}
