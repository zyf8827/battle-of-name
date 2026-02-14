import seedrandom from 'seedrandom';

import { runBattle } from '../src/engine/engine.ts';
import { defaultBattleContentAdapter } from '../src/content/battleContentAdapter.ts';
import { classes } from '../src/content/classes/index.ts';

type PanelStats = {
  STR: number;
  AGI: number;
  VIT: number;
  LUK: number;
};

type Tier = 'weak' | 'normal' | 'strong' | 'extreme';

type TierStat = {
  count: number;
  wins: number;
  roundsSum: number;
};

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    return [key, value ?? 'true'];
  }),
);

const total = Number(args.total ?? 5000);
const seed = String(args.seed ?? 'panel-influence-v1');
const withBattle = String(args.withBattle ?? 'true') !== 'false';

const chars =
  '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜马牛猫狗鸟鱼龙凤虎豹宇宙量子朋克摸鱼摆烂玄学暴富社死';

function randomName(rng: seedrandom.PRNG): string {
  const len = rng() < 0.62 ? 2 : rng() < 0.9 ? 3 : 4;
  let value = '';
  for (let i = 0; i < len; i += 1)
    value += chars[Math.floor(rng() * chars.length)];
  return value;
}

function sumPanel(stats: PanelStats): number {
  return stats.STR + stats.AGI + stats.VIT + stats.LUK;
}

function tierOf(sum: number): Tier {
  if (sum <= 32) return 'weak';
  if (sum <= 44) return 'normal';
  if (sum <= 56) return 'strong';
  return 'extreme';
}

function percentile(values: number[], ratio: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.floor((sorted.length - 1) * ratio)),
  );
  return sorted[index];
}

const panelSums: number[] = [];
const classSums: number[] = [];
const ratioPanelToClass: number[] = [];
const specializationSpread: number[] = [];
const classShare: number[] = [];
let noClassCount = 0;
const tierStats: Record<Tier, TierStat> = {
  weak: { count: 0, wins: 0, roundsSum: 0 },
  normal: { count: 0, wins: 0, roundsSum: 0 },
  strong: { count: 0, wins: 0, roundsSum: 0 },
  extreme: { count: 0, wins: 0, roundsSum: 0 },
};

for (let i = 0; i < total; i += 1) {
  const rng = seedrandom(`${seed}:name:${i}`);
  const name1 = randomName(rng);
  const name2 = randomName(rng);
  const battleSeed = `${seed}:battle:${i}`;

  const bootstrap = defaultBattleContentAdapter.bootstrap({
    name1,
    name2,
    seed: battleSeed,
  });
  const battle = withBattle
    ? runBattle(
        { name1, name2, seed: battleSeed },
        defaultBattleContentAdapter,
        { diagnostics: { debugLog: false, collectSummary: false } },
      )
    : undefined;

  for (const unit of bootstrap.units) {
    const classSpec = unit.classId ? classes[unit.classId] : undefined;
    const classBase = classSpec?.baseStats ?? {
      STR: 0,
      AGI: 0,
      VIT: 0,
      LUK: 0,
    };
    const panel: PanelStats = {
      STR: unit.stats.STR - classBase.STR,
      AGI: unit.stats.AGI - classBase.AGI,
      VIT: unit.stats.VIT - classBase.VIT,
      LUK: unit.stats.LUK - classBase.LUK,
    };

    const panelSum = sumPanel(panel);
    const classSum =
      classBase.STR + classBase.AGI + classBase.VIT + classBase.LUK;
    const ratio = classSum > 0 ? panelSum / classSum : undefined;
    const spread =
      Math.max(panel.STR, panel.AGI, panel.VIT, panel.LUK) -
      Math.min(panel.STR, panel.AGI, panel.VIT, panel.LUK);
    const share =
      classSum > 0 && classSum + panelSum > 0
        ? classSum / (classSum + panelSum)
        : undefined;

    panelSums.push(panelSum);
    classSums.push(classSum);
    if (typeof ratio === 'number') ratioPanelToClass.push(ratio);
    specializationSpread.push(spread);
    if (typeof share === 'number') classShare.push(share);
    if (!unit.classId) noClassCount += 1;

    const tier = tierOf(panelSum);
    tierStats[tier].count += 1;
    if (withBattle && battle) {
      if (battle.winnerId === unit.id) tierStats[tier].wins += 1;
      tierStats[tier].roundsSum += battle.summary.totalRounds;
    }
  }
}

const avgPanel = panelSums.reduce((a, b) => a + b, 0) / panelSums.length;
const avgClass = classSums.reduce((a, b) => a + b, 0) / classSums.length;
const avgRatio =
  ratioPanelToClass.length > 0
    ? ratioPanelToClass.reduce((a, b) => a + b, 0) / ratioPanelToClass.length
    : 0;

const output = {
  config: { total, seed, withBattle },
  panelDistribution: {
    min: Math.min(...panelSums),
    p10: percentile(panelSums, 0.1),
    p25: percentile(panelSums, 0.25),
    p50: percentile(panelSums, 0.5),
    p75: percentile(panelSums, 0.75),
    p90: percentile(panelSums, 0.9),
    max: Math.max(...panelSums),
    avg: Number(avgPanel.toFixed(2)),
  },
  classDistribution: {
    min: Math.min(...classSums),
    p50: percentile(classSums, 0.5),
    p90: percentile(classSums, 0.9),
    max: Math.max(...classSums),
    avg: Number(avgClass.toFixed(2)),
  },
  influenceRatio: {
    samplesWithClass: ratioPanelToClass.length,
    noClassPct: Number(((noClassCount / panelSums.length) * 100).toFixed(2)),
    avgPanelToClass: Number(avgRatio.toFixed(3)),
    medianPanelToClass: Number(percentile(ratioPanelToClass, 0.5).toFixed(3)),
    p10PanelToClass: Number(percentile(ratioPanelToClass, 0.1).toFixed(3)),
    p90PanelToClass: Number(percentile(ratioPanelToClass, 0.9).toFixed(3)),
    avgClassShareInFinalStats: Number(
      (classShare.length > 0
        ? classShare.reduce((a, b) => a + b, 0) / classShare.length
        : 0
      ).toFixed(3),
    ),
  },
  specialization: {
    avgSpread: Number(
      (
        specializationSpread.reduce((a, b) => a + b, 0) /
        specializationSpread.length
      ).toFixed(2),
    ),
    p50Spread: percentile(specializationSpread, 0.5),
    p90Spread: percentile(specializationSpread, 0.9),
    extremeSkewPct: Number(
      (
        (specializationSpread.filter((s) => s >= 10).length /
          specializationSpread.length) *
        100
      ).toFixed(2),
    ),
  },
  tiers: Object.fromEntries(
    (Object.entries(tierStats) as Array<[Tier, TierStat]>).map(
      ([tier, stat]) => [
        tier,
        {
          count: stat.count,
          pct: Number(((stat.count / panelSums.length) * 100).toFixed(2)),
          winRate:
            withBattle && stat.count > 0
              ? Number((stat.wins / stat.count).toFixed(4))
              : undefined,
          avgRounds:
            withBattle && stat.count > 0
              ? Number((stat.roundsSum / stat.count).toFixed(2))
              : undefined,
        },
      ],
    ),
  ),
  interpretationHint: {
    target: '希望基础面板与职业影响接近1:1',
    goodRange:
      'avgPanelToClass 建议在 0.9 ~ 1.2，且 weak/normal/strong/extreme 四档都应有样本',
  },
};

console.log(JSON.stringify(output, null, 2));
