import type { EventPoolEntry } from '../../../engine/types';

// Global (Round)
import trafficJam from './trafficJam';
import heavyRain from './heavyRain';
import neighborRenovation from './neighborRenovation';
import heatAllowance from './heatAllowance';
import powerOutage from './powerOutage';
import acBreak from './acBreak';
import annivRed from './annivRed';
import trafficRed from './trafficRed';
import snackParty from './snackParty';
import forcedCheckup from './forcedCheckup';

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
import toiletBoss from './toiletBoss';
import momentLike from './momentLike';
import workWrongMsg from './workWrongMsg';
import elevatorFart from './elevatorFart';
import wechatSport from './wechatSport';
import interviewEx from './interviewEx';
import bikeChain from './bikeChain';
import otFriday from './otFriday';
import redPenny from './redPenny';
import hairFood from './hairFood';
import cameraOn from './cameraOn';
import misIdol from './misIdol';
import toiletPaper from './toiletPaper';
import eggScan from './eggScan';
import dupGacha from './dupGacha';
import soupSpill from './soupSpill';
import groupIgnored from './groupIgnored';
import recallOk from './recallOk';
import riderGift from './riderGift';
import viralSelf from './viralSelf';
import gymOnce from './gymOnce';
import hiddenGacha from './hiddenGacha';
import refundCoupon from './refundCoupon';

export const roundEventEntries: EventPoolEntry[] = [
  trafficJam,
  heavyRain,
  neighborRenovation,
  heatAllowance,
  powerOutage,
  acBreak,
  annivRed,
  trafficRed,
  snackParty,
  forcedCheckup,
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
  toiletBoss,
  momentLike,
  workWrongMsg,
  elevatorFart,
  wechatSport,
  interviewEx,
  bikeChain,
  otFriday,
  redPenny,
  hairFood,
  cameraOn,
  misIdol,
  toiletPaper,
  eggScan,
  dupGacha,
  soupSpill,
  groupIgnored,
  recallOk,
  riderGift,
  viralSelf,
  gymOnce,
  hiddenGacha,
  refundCoupon,
];

export const eventEntries: EventPoolEntry[] = [...roundEventEntries, ...turnEventEntries];

const eventEntryCatalog: Record<string, EventPoolEntry> = Object.fromEntries(
  eventEntries.map((item) => [item.id, item]),
);

export function getEventEntryById(id: string): EventPoolEntry | undefined {
  return eventEntryCatalog[id];
}
