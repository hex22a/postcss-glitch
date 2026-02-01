import type { Root, PluginCreator } from 'postcss';
import createTranslator from './translator';

export const DECLARATION_NAME = 'glitch';
export const PLUGIN_NAME = 'postcss-glitch';

const transformer: PluginCreator<void> = () => {
  const translate = createTranslator();

  return {
    postcssPlugin: PLUGIN_NAME,
    Once(root: Root) {
      root.walkDecls(DECLARATION_NAME, translate);
    },
  };
};

transformer.postcss = true;

export default transformer;

