import type { Declaration } from 'postcss';
import { TextStrategy } from './text';
import { SvgStrategy } from './svg';

export type StrategyDependencies = {
  positionRelative: (declaration: Declaration) => void,
  addPseudo: (declaration: Declaration) => void,
  addKeyframes: (declaration: Declaration) => void,
  removeDeclaration: (declaration: Declaration) => void,
  findBackgroundImage?: (declaration: Declaration) => void;
  backgroundImage?: string;
}

export interface StrategyConstructor {
  new(deps?: StrategyDependencies): Strategy;
}

export interface Strategy {
  execute(declaration: Declaration): void
}
export type Strategies = Record<string, StrategyConstructor>;

export const defaultStrategies: Strategies  = {
  text: TextStrategy,
  svg: SvgStrategy,
};

export type GlitchMode = keyof Strategies;
