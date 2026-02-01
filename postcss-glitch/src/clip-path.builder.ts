import type { Declaration } from 'postcss';
import { decl } from 'postcss';

export const getOffsetTop = (height: number): number => Math.floor(Math.random() * height);
export const getOffsetBottom = (height: number, offsetTop: number, glitchHeight: number): number =>
  height - offsetTop - glitchHeight;
export const parseHeight = (height: string): [number, string] => [
  Number.parseInt(height.substring(0, height.length - height.replace(/\d/g, '').length), 10),
  height.substring(height.length - height.replace(/\d/g, '').length, height.length),
];

export const utils = { getOffsetTop, getOffsetBottom, parseHeight };

export default (height: string, glitchHeight = 5): Declaration => {
  const [parsedHeight, sizeUnit] = utils.parseHeight(height);
  const offsetTop = utils.getOffsetTop(parsedHeight);
  const offsetBottom = utils.getOffsetBottom(parsedHeight, offsetTop, glitchHeight);
  return decl({ prop: 'clip-path', value: `inset(${offsetTop}${sizeUnit} 0 ${offsetBottom}${sizeUnit} 0)` });
};
