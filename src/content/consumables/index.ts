import type { Consumable } from '../base/consumable';
export { DEFAULT_CONSUMABLE_WEIGHT } from '../base/consumable';

import adrenalineShot from './adrenalineShot';
import cola from './cola';
import icedAmericano from './icedAmericano';
import bossPie from './bossPie';
import syrup from './syrup';
import heartPills from './heartPills';
import expiredSandwich from './expiredSandwich';
import hotWater from './hotWater';
import hairTonic from './hairTonic';
import koiAmulet from './koiAmulet';
import brick from './brick';
import fidgetSpinner from './fidgetSpinner';
import durian from './durian';
import lego from './lego';
import friendZoneCard from './friendZoneCard';
import lemon from './lemon';
import essentialBalm from './essentialBalm';
import regretPill from './regretPill';
import leaveRequest from './leaveRequest';
import moneyPower from './moneyPower';
import schrodingerFood from './schrodingerFood';
import page404 from './page404';
import fillerItem from './fillerItem';

export const consumables: Consumable[] = [
  adrenalineShot,
  cola,
  icedAmericano,
  bossPie,
  syrup,
  heartPills,
  expiredSandwich,
  hotWater,
  hairTonic,
  koiAmulet,
  brick,
  fidgetSpinner,
  durian,
  lego,
  friendZoneCard,
  lemon,
  essentialBalm,
  regretPill,
  leaveRequest,
  moneyPower,
  schrodingerFood,
  page404,
  fillerItem,
];

export const consumableIds: string[] = consumables.map((item) => item.id);

const consumableCatalog: Record<string, Consumable> = Object.fromEntries(
  consumables.map((item) => [item.id, item]),
);

export function getConsumableById(id: string): Consumable | undefined {
  return consumableCatalog[id];
}
