import type { TextTemplate } from './text';
import type { EffectSpec } from '../../engine/types';

export const DEFAULT_CONSUMABLE_WEIGHT = 1;

export type Consumable = {
  id: string;
  name: string;
  description: string;
  weight?: number;
  effects?: EffectSpec[];
  texts?: {
    use?: TextTemplate;
    trigger?: TextTemplate;
  };
};
