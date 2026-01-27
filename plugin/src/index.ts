import type { Root, PluginCreator } from 'postcss';
import utils from './translator';

export const DECLARATION_NAME = 'glitch';
export const PLUGIN_NAME = 'postcss-glitch';

const transformer: PluginCreator<void> = () => ({
  postcssPlugin: PLUGIN_NAME,
  Once(root: Root) {
    root.walkDecls(DECLARATION_NAME, utils.translate);
  },
});

transformer.postcss = true;

export default transformer;

