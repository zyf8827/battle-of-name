import type { CharacterClass } from '../base/characterClass';
export { DEFAULT_CLASS_WEIGHT } from '../base/characterClass';

import brawler from './brawler';
import partyA from './partyA';
import slackingMaster from './slackingMaster';
import pptArchitect from './pptArchitect';
import simp from './simp';
import aquaman from './aquaman';
import spoiler from './spoiler';
import repeater from './repeater';
import stylistTony from './stylistTony';
import drivingInstructor from './drivingInstructor';
import brat from './brat';
import civilServant from './civilServant';
import ddlWarrior from './ddlWarrior';
import quitter from './quitter';
import vibeGroup from './vibeGroup';
import livingEtc from './livingEtc';
import flaker from './flaker';

export const classList: CharacterClass[] = [
  brawler,
  partyA,
  slackingMaster,
  pptArchitect,
  simp,
  aquaman,
  spoiler,
  repeater,
  stylistTony,
  drivingInstructor,
  brat,
  civilServant,
  ddlWarrior,
  quitter,
  vibeGroup,
  livingEtc,
  flaker,
];

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
