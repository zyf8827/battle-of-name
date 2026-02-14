import type { BaseStats, Modifier } from '../../engine/types';
import type { TextTemplate } from './text';

export const DEFAULT_CLASS_WEIGHT = 1;

export type CharacterClass = {
  id: string;
  name: string;
  description?: string;
  weight?: number;
  baseStats: BaseStats;
  talents: Modifier[];
  texts?: {
    intro?: TextTemplate;
  };
};
