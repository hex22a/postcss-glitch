import type { Declaration } from 'postcss';
import { TextStrategy } from './text';

export type StrategyDependencies = {
  positionRelative: (declaration: Declaration) => void,
  addPseudo: (declaration: Declaration) => void,
  addKeyframes: (declaration: Declaration) => void,
  removeDeclaration: (declaration: Declaration) => void,
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
};

export type GlitchMode = keyof Strategies;
