
import seedrandom from 'seedrandom';
import type { Character, Career, Item } from './types';
import { careers } from './definitions/careers';
import { items } from './definitions/items';

export function createCharacter(name: string): Character {
  const rng = seedrandom(name);
  const career = careers[Math.floor(rng() * careers.length)];
  const startingItem = items[Math.floor(rng() * items.length)];

  // 定义更宽的基础属性范围
  const baseHpMin = 900;
  const baseHpMax = 1100; // 范围 200
  const baseAtkMin = 70;
  const baseAtkMax = 100; // 范围 30
  const baseDefMin = 30;
  const baseDefMax = 50; // 范围 20
  const baseSpeedMin = 30;
  const baseSpeedMax = 50; // 范围 20

  let currentHpMin = baseHpMin;
  let currentHpMax = baseHpMax;
  let currentAtkMin = baseAtkMin;
  let currentAtkMax = baseAtkMax;
  let currentDefMin = baseDefMin;
  let currentDefMax = baseDefMax;
  let currentSpeedMin = baseSpeedMin;
  let currentSpeedMax = baseSpeedMax;

  // 随机选择一个属性倾向
  const statProfiles = ['balanced', 'offense', 'defense', 'speedy'] as const;
  type StatProfile = typeof statProfiles[number];
  const profile: StatProfile = statProfiles[Math.floor(rng() * statProfiles.length)];

  // 根据属性倾向调整范围，增加差异性
  switch (profile) {
    case 'offense':
      currentAtkMin += 15; currentAtkMax += 15; // 显著提升攻击
      currentDefMin -= 5; currentDefMax -= 5;   // 降低防御
      currentSpeedMin -= 3; currentSpeedMax -= 3; // 轻微降低速度
      currentHpMin -= 20; currentHpMax -= 20; // 轻微降低生命
      break;
    case 'defense':
      currentDefMin += 15; currentDefMax += 15; // 显著提升防御
      currentAtkMin -= 5; currentAtkMax -= 5;   // 降低攻击
      currentSpeedMin -= 3; currentSpeedMax -= 3; // 轻微降低速度
      currentHpMin -= 20; currentHpMax -= 20; // 轻微降低生命
      break;
    case 'speedy':
      currentSpeedMin += 15; currentSpeedMax += 15; // 显著提升速度
      currentAtkMin -= 3; currentAtkMax -= 3;   // 轻微降低攻击
      currentDefMin -= 3; currentDefMax -= 3;   // 轻微降低防御
      currentHpMin -= 20; currentHpMax -= 20; // 轻微降低生命
      break;
    case 'balanced':
    default:
      // 平衡型，给予整体小幅提升，使其不至于太弱
      currentHpMin += 10; currentHpMax += 10;
      currentAtkMin += 5; currentAtkMax += 5;
      currentDefMin += 5; currentDefMax += 5;
      currentSpeedMin += 5; currentSpeedMax += 5;
      break;
  }

  // 确保最小值不低于合理值
  currentHpMin = Math.max(100, currentHpMin);
  currentAtkMin = Math.max(1, currentAtkMin);
  currentDefMin = Math.max(1, currentDefMin);
  currentSpeedMin = Math.max(1, currentSpeedMin);

  // 确保最大值不低于最小值
  currentHpMax = Math.max(currentHpMin, currentHpMax);
  currentAtkMax = Math.max(currentAtkMin, currentAtkMax);
  currentDefMax = Math.max(currentDefMin, currentDefMax);
  currentSpeedMax = Math.max(currentSpeedMin, currentSpeedMax);


  // 在调整后的范围内生成属性
  const hp = Math.floor(rng() * (currentHpMax - currentHpMin + 1)) + currentHpMin;
  const atk = Math.floor(rng() * (currentAtkMax - currentAtkMin + 1)) + currentAtkMin;
  const def = Math.floor(rng() * (currentDefMax - currentDefMin + 1)) + currentDefMin;
  const speed = Math.floor(rng() * (currentSpeedMax - currentSpeedMin + 1)) + currentSpeedMin;

  const baseStats = {
    hp: hp,
    atk: atk,
    def: def,
    speed: speed,
    critRate: 0.1, // 暴击率保持固定
    critDmg: 1.5, // 暴击伤害保持固定
  };

  const character: Character = {
    name,
    level: 1,
    career,
    stats: {
      maxHp: baseStats.hp,
      hp: baseStats.hp,
      attack: baseStats.atk,
      defense: baseStats.def,
      speed: baseStats.speed,
      critRate: baseStats.critRate,
      critDamage: baseStats.critDmg,
    },
    statusEffects: [],
    items: [startingItem],
    equipment: {
      weapon: null,
      armor: null,
      accessory: null,
    },
  };

  // Apply career modifiers
  if (career.modifiers) {
    character.stats.maxHp += career.modifiers.hp || 0;
    character.stats.hp += career.modifiers.hp || 0;
    character.stats.attack += career.modifiers.atk || 0;
    character.stats.defense += career.modifiers.def || 0;
    character.stats.speed += career.modifiers.speed || 0;
    character.stats.critRate += career.modifiers.critRate || 0;
    character.stats.critDamage += career.modifiers.critDmg || 0;
  }

  return character;
}
