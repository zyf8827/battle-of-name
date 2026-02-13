import type { CharacterClass } from '../base/characterClass';

import brawler from './brawler';
import sustainer from './sustainer';

export const classList: CharacterClass[] = [brawler, sustainer];

export const classes: Record<string, CharacterClass> = Object.fromEntries(
  classList.map((item) => [item.id, item]),
);

export function getClassById(id: string): CharacterClass {
  const found = classes[id];
  if (!found) {
    throw new Error(`Unknown class: ${id}`);
  }
  return found;
}
