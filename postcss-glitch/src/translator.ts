import type { Declaration, Rule } from 'postcss';
import { atRule, decl, list, rule } from 'postcss';
import clipPath from './clip-path.builder';

export type TranslatorDeps = {
  positionRelative: (declaration: Declaration) => void;
  addPseudo: (declaration: Declaration) => void;
  addKeyframes: (declaration: Declaration) => void;
  removeDeclaration: (declaration: Declaration) => void;
};

export const defaultTranslator: TranslatorDeps = {
  positionRelative(declaration: Declaration): void  {
    const parent: Rule = declaration.parent as Rule;
    parent.prepend(decl({ prop: 'position', value: 'relative' }));
  },

  addPseudo(declaration: Declaration): void {
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
      .append(decl({ prop: 'content', value: 'attr(data-text)' }))
      .append(decl({ prop: 'position', value: 'absolute' }))
      .append(decl({ prop: 'top', value: '0' }))
      .append(decl({ prop: 'left', value: '0' }))
      .append(decl({ prop: 'overflow', value: 'hidden' }))
      .append(decl({ prop: 'clip-path', value: `inset(${height} 0 0 0)` }));
    if (declaration.parent) {
      declaration.parent.after(afterRule);
      declaration.parent.after(beforeRule);
      declaration.parent.after(beforeAfterRule);
    }
  },

  addKeyframes(declaration: Declaration): void {
    const [height] = list.space(declaration.value);
    if (height) {
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
    }
  },

  removeDeclaration(declaration: Declaration): void {
    declaration.remove();
  },
};

export default function createTranslator(deps: TranslatorDeps = defaultTranslator): (declaration: Declaration) => void {
  return (declaration: Declaration) => {
    deps.positionRelative(declaration);
    deps.addPseudo(declaration);
    deps.addKeyframes(declaration);
    deps.removeDeclaration(declaration);
  };
};
