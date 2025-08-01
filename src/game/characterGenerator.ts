
import seedrandom from 'seedrandom';
import { Character, Career, Item } from './types';
import { careers } from './definitions/careers';
import { items } from './definitions/items';

export function createCharacter(name: string): Character {
  const rng = seedrandom(name);
  const career = careers[Math.floor(rng() * careers.length)];
  const startingItem = items[Math.floor(rng() * items.length)];

  const baseStats = {
    hp: Math.floor(rng() * 100) + 1000,
    atk: Math.floor(rng() * 20) + 80,
    def: Math.floor(rng() * 10) + 40,
    speed: Math.floor(rng() * 10) + 40,
    critRate: 0.1,
    critDmg: 1.5,
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
