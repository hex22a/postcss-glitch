import type { Declaration } from 'postcss';
import { list } from 'postcss';
import type { GlitchMode, Strategies } from './strategies';
import { defaultStrategies } from './strategies';

export default function createTranslator(Strategy: Strategies = defaultStrategies): (declaration: Declaration) => void {
  return (declaration: Declaration) => {
    const mode: GlitchMode = list.space(declaration.value)[0] as GlitchMode;
    if (!Strategy[mode]) {
      throw new Error(`Unknown glitch mode: ${mode}`);
    }
    const strategy = new Strategy[mode]();
    strategy.execute(declaration);
  };
};
