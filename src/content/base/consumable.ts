import type { TextTemplate } from './text';
import type { EffectSpec } from '../../engine/types';

export type Consumable = {
  id: string;
  name: string;
  description: string;
  effects?: EffectSpec[];
  texts?: {
    use?: TextTemplate;
    trigger?: TextTemplate;
  };
};
