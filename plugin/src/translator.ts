import type { Declaration, Rule } from 'postcss';
import { atRule, decl, list, rule } from 'postcss';
import clipPath from './clip-path.builder';

const CONTENT_DECLARATION = decl({ prop: 'content', value: 'attr(data-text)' });
const POSITION_DECLARATION = decl({ prop: 'position', value: 'absolute' });
const TOP_DECLARATION = decl({ prop: 'top', value: '0' });
const LEFT_DECLARATION = decl({ prop: 'left', value: '0' });
const OVERFLOW_DECLARATION = decl({ prop: 'overflow', value: 'hidden' });

export default class Translator {
  static addPseudo = (declaration: Declaration): void => {
    const [height, firstColor, secondColor, shadowOffset] = list.space(declaration.value);
    const parent: Rule = declaration.parent as Rule;
    const selector: string = parent.selector;
    const beforeRule = rule({ selector: `${selector}::before` });
    beforeRule
      .append(decl({ prop: 'text-shadow', value: `-${shadowOffset} 0 ${firstColor}` }))
      .append(decl({ prop: 'animation', value: 'glitch-animation-before alternate-reverse 3s infinite linear' }));
    const afterRule = rule({ selector: `${selector}::after` });
    afterRule
      .append(decl({ prop: 'text-shadow', value: `${shadowOffset} 0 ${secondColor}` }))
      .append(decl({ prop: 'animation', value: 'glitch-animation-after alternate-reverse 2s infinite linear' }));
    const beforeAfterRule = rule({ selectors: [`${selector}::before`, `${selector}::after`] });
    beforeAfterRule
      .append(CONTENT_DECLARATION)
      .append(POSITION_DECLARATION)
      .append(TOP_DECLARATION)
      .append(LEFT_DECLARATION)
      .append(OVERFLOW_DECLARATION)
      .append(decl({ prop: 'clip-path', value: `inset(${height} 0 0 0)` }));
    if (declaration.parent) {
      declaration.parent.after(afterRule);
      declaration.parent.after(beforeRule);
      declaration.parent.after(beforeAfterRule);
    }
  };

  static addKeyframes = (declaration: Declaration): void => {
    const [height] = list.space(declaration.value);
    const root = declaration.root();
    const keyframeBefore = atRule({ name: 'keyframes', params: 'glitch-animation-before' });
    const keyframeAfter = atRule({ name: 'keyframes', params: 'glitch-animation-after' });
    for (let progress = 0; progress <= 100; progress += 5) {
      const progressRuleBefore = rule({ selector: `${progress}%` });
      const progressRuleAfter = rule({ selector: `${progress}%` });
      const cp1 = clipPath(height);
      progressRuleBefore.append(cp1);
      const cp2 = clipPath(height);
      progressRuleAfter.append(cp2);
      keyframeBefore.append(progressRuleBefore);
      keyframeAfter.append(progressRuleAfter);
    }
    root.prepend(keyframeAfter);
    root.prepend(keyframeBefore);
  };

  static removeDeclaration = (declaration: Declaration): void => {
    declaration.remove();
  };

  static translate = (declaration: Declaration): void => {
    Translator.addPseudo(declaration);
    Translator.addKeyframes(declaration);
    Translator.removeDeclaration(declaration);
  };
}
