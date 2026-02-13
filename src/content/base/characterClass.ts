import type { BaseStats, Modifier } from '../../engine/types';
import type { TextTemplate } from './text';

export type CharacterClass = {
  id: string;
  name: string;
  description?: string;
  baseStats: BaseStats;
  talents: Modifier[];
  texts?: {
    intro?: TextTemplate;
  };
};
