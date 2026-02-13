import type { EventPoolEntry } from '../../../engine/types';

// Global (Round)
import trafficJam from './trafficJam';
import heavyRain from './heavyRain';
import neighborRenovation from './neighborRenovation';
import heatAllowance from './heatAllowance';
import powerOutage from './powerOutage';

// Personal (Turn)
import mondayMorning from './mondayMorning';
import fridayMsg from './fridayMsg';
import pptCrash from './pptCrash';
import forcedTeamBuilding from './forcedTeamBuilding';
import colleaguePot from './colleaguePot';
import coffeeSpill from './coffeeSpill';
import bigPie from './bigPie';
import paidPoop from './paidPoop';
import yearEndBonus from './yearEndBonus';
import colorfulBlack from './colorfulBlack';
import stepLego from './stepLego';
import coldShower from './coldShower';
import forgotPhone from './forgotPhone';
import bogoMilktea from './bogoMilktea';
import midnightEmo from './midnightEmo';
import badHaircut from './badHaircut';
import queueJump from './queueJump';
import lotteryWin from './lotteryWin';
import melonOnMe from './melonOnMe';
import memeVictory from './memeVictory';
import momentLeak from './momentLeak';
import uselessCoupon from './uselessCoupon';
import cameraAccident from './cameraAccident';
import deliveryWarmth from './deliveryWarmth';
import greenTea from './greenTea';

export const roundEventEntries: EventPoolEntry[] = [
  trafficJam,
  heavyRain,
  neighborRenovation,
  heatAllowance,
  powerOutage,
];

export const turnEventEntries: EventPoolEntry[] = [
  mondayMorning,
  fridayMsg,
  pptCrash,
  forcedTeamBuilding,
  colleaguePot,
  coffeeSpill,
  bigPie,
  paidPoop,
  yearEndBonus,
  colorfulBlack,
  stepLego,
  coldShower,
  forgotPhone,
  bogoMilktea,
  midnightEmo,
  badHaircut,
  queueJump,
  lotteryWin,
  melonOnMe,
  memeVictory,
  momentLeak,
  uselessCoupon,
  cameraAccident,
  deliveryWarmth,
  greenTea,
];

export const eventEntries: EventPoolEntry[] = [...roundEventEntries, ...turnEventEntries];

const eventEntryCatalog: Record<string, EventPoolEntry> = Object.fromEntries(
  eventEntries.map((item) => [item.id, item]),
);

export function getEventEntryById(id: string): EventPoolEntry | undefined {
  return eventEntryCatalog[id];
}
