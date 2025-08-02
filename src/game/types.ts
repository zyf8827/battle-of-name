
import seedrandom from 'seedrandom';

export interface StatusEffect {
  id: string;
  name: string;
  duration: number;
  modifiers?: {
    atk?: number;
    def?: number;
    speed?: number;
    critRate?: number;
    critDmg?: number;
  };
  hooks?: {
    onBeforeAttack?: (self: Character, target: Character, state: BattleState) => boolean | void;
    onTurnEnd?: (self: Character, state: BattleState) => void;
    onDeath?: (self: Character, state: BattleState) => boolean; // Return true to prevent death
  };
}

export interface Attribute {
  id: string;
  name: string;
  description: string;
}

export interface CharacterStats {
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  critRate: number;
  critDamage: number;
}

export interface Item extends Attribute {
    use: (self: Character, state: BattleState) => void;
}

export type EquipmentType = 'weapon' | 'armor' | 'accessory';

export interface Equipment extends Attribute {
  type: EquipmentType;
  stats: Partial<CharacterStats>;
  hooks?: {
    onTurnEnd?: (self: Character, state: BattleState) => void;
    onAfterAttack?: (self: Character, target: Character, state: BattleState) => void;
  };
}

export interface Character {
  name: string;
  level: number;
  career: Career;
  stats: CharacterStats;
  statusEffects: StatusEffect[];
  items: Item[];
  equipment: {
    weapon: Equipment | null;
    armor: Equipment | null;
    accessory: Equipment | null;
  };
}

export interface BattleState {
  player1: Character;
  player2: Character;
  battleSeed: string;
  // References to the players for the current turn
  activePlayer: Character;
  opponent: Character;
  log: string[];
  rng: () => number;
  addStatusEffect: (target: Character, effect: StatusEffect) => void;
  logEvent: (message: string) => void;
  checkProbability: (key: string, probability: number) => boolean;
  stats: {
    [characterName: string]: {
      totalDamageDealt: number;
    };
  };
  lastAction?: { type: 'attack' | 'useItem'; item?: Item; };
}

export interface Career {
  id: string;
  name: string;
  description: string;
  modifiers?: {
    hp?: number;
    atk?: number;
    def?: number;
    speed?: number;
    critRate?: number;
    critDmg?: number;
  };
  hooks?: {
    onBattleStart?: (self: Character, state: BattleState) => void;
    onTurnStart?: (self: Character, state: BattleState) => void;
    onBeforeAttack?: (self: Character, target: Character, state: BattleState) => boolean | void;
    onAfterAttack?: (self: Character, target: Character, state: BattleState) => void;
    onCalculateDamage?: (damage: number, source: Character, target: Character) => number;
    onTurnEnd?: (self: Character, state: BattleState) => void;
  };
}

export interface GameEvent {
    id: string;
    name: string;
    description: string;
    hooks?: {
        onTurnStart?: (state: BattleState) => void;
    }
}
