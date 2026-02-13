import type { Consumable } from '../base/consumable';

import adrenalineShot from './adrenalineShot';

export const consumables: Consumable[] = [adrenalineShot];
export const consumableIds: string[] = consumables.map((item) => item.id);

const consumableCatalog: Record<string, Consumable> = Object.fromEntries(consumables.map((item) => [item.id, item]));

export function getConsumableById(id: string): Consumable | undefined {
	return consumableCatalog[id];
}
