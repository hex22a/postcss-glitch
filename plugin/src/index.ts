import type { Root, Plugin } from 'postcss';
import utils from './translator';

export const DECLARATION_NAME = 'glitch';
export const PLUGIN_NAME = 'postcss-glitch';

const transformer = (): Plugin => ({
  postcssPlugin: PLUGIN_NAME,
  Once(root: Root) {
    root.walkDecls(DECLARATION_NAME, utils.translate);
  },
});

export const postcss = true;

export default transformer;

