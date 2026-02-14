import type { Modifier } from '../../engine/types';
import { deepCloneKeepFns } from '../../engine/clone';

import type { EquipmentLike } from '../base/equipment';
export { DEFAULT_EQUIPMENT_WEIGHT } from '../base/equipment';

import antiCringeFieldCoat from './antiCringeFieldCoat';
import apologyTemplateGenerator from './apologyTemplateGenerator';
import blameCatapult from './blameCatapult';
import blankAward from './blankAward';
import cannotUndoSendKey from './cannotUndoSendKey';
import carbonLifePatch from './carbonLifePatch';
import cosmicExcuseLibrary from './cosmicExcuseLibrary';
import cyberAmuletQr from './cyberAmuletQr';
import cyberIncenseBox from './cyberIncenseBox';
import disconnectShell from './disconnectShell';
import duelSprayer from './duelSprayer';
import electronicMeritRobe from './electronicMeritRobe';
import electronicMuyuHF from './electronicMuyuHF';
import embarrassmentRecycleBag from './embarrassmentRecycleBag';
import emotionalValueGenerator from './emotionalValueGenerator';
import goodLuckReadReceipt from './goodLuckReadReceipt';
import keyboard from './keyboard';
import moyuPermit from './moyuPermit';
import mysticBadge from './mysticBadge';
import networkCardExperience from './networkCardExperience';
import overconfidentBadge from './overconfidentBadge';
import readIgnoreBoomerang from './readIgnoreBoomerang';
import reverseChickenSoupSpeaker from './reverseChickenSoupSpeaker';
import slackArmorUltimate from './slackArmorUltimate';
import slackPermit from './slackPermit';
import soberRaincoat from './soberRaincoat';
import socialPhobiaMic from './socialPhobiaMic';
import thickSkinMecha from './thickSkinMecha';
import thorns from './thorns';
import urgentRedHeadDoc from './urgentRedHeadDoc';
import voiceToTextMachine from './voiceToTextMachine';

export const equipments: EquipmentLike[] = [
  keyboard,
  thorns,
  readIgnoreBoomerang,
  moyuPermit,
  reverseChickenSoupSpeaker,
  urgentRedHeadDoc,
  electronicMuyuHF,
  socialPhobiaMic,
  cannotUndoSendKey,
  voiceToTextMachine,
  emotionalValueGenerator,
  cyberIncenseBox,
  blameCatapult,
  mysticBadge,
  duelSprayer,
  antiCringeFieldCoat,
  slackArmorUltimate,
  soberRaincoat,
  disconnectShell,
  electronicMeritRobe,
  thickSkinMecha,
  embarrassmentRecycleBag,
  goodLuckReadReceipt,
  cyberAmuletQr,
  blankAward,
  apologyTemplateGenerator,
  networkCardExperience,
  carbonLifePatch,
  overconfidentBadge,
  cosmicExcuseLibrary,
  slackPermit,
];
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
