import type { Strategy, StrategyDependencies } from './index';
import type { Declaration, Rule } from 'postcss';
import { atRule } from 'postcss';
import { list, rule } from 'postcss';
import { decl } from 'postcss';
import clipPath from '../clip-path.builder';

export const defaultSvgStrategyDependencies: StrategyDependencies = {
  findBackgroundImage(declaration: Declaration): void {
    const parent: Rule = declaration.parent as Rule;
    const found = parent.walkDecls('background-image', decl => {
      this.backgroundImage = decl.value;
    });
    if (found == false) {
      throw new Error('background-image is required');
    }
  },
  addKeyframes(declaration: Declaration): void {
    const [, height] = list.space(declaration.value);
    if (height) {
      const root = declaration.root();
      const keyframeBefore = atRule({ name: 'keyframes', params: 'glitch-svg-animation-before' });
      const keyframeAfter = atRule({ name: 'keyframes', params: 'glitch-svg-animation-after' });
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
  addPseudo(declaration: Declaration): void {
    const [, , firstColor, secondColor, shadowOffset] = list.space(declaration.value);
    const parent: Rule = declaration.parent as Rule;
    const selector: string = parent.selector;
    const beforeRule = rule({ selector: `${selector}::before` });
    beforeRule
      .append(decl({ prop: 'transform', value: `translate(-${shadowOffset}, 0)` }))
      .append(decl({ prop: 'filter', value: `drop-shadow(-${shadowOffset} 0 ${firstColor})` }))
      .append(decl({ prop: 'animation', value: 'glitch-svg-animation-before alternate-reverse 3s infinite linear' }));
    const afterRule = rule({ selector: `${selector}::after` });
    afterRule
      .append(decl({ prop: 'transform', value: `translate(${shadowOffset}, 0)` }))
      .append(decl({ prop: 'filter', value: `drop-shadow(${shadowOffset} 0 ${secondColor})` }))
      .append(decl({ prop: 'animation', value: 'glitch-svg-animation-after alternate-reverse 2s infinite linear' }));
    const beforeAfterRule = rule({ selectors: [`${selector}::before`, `${selector}::after`] });
    beforeAfterRule
      .append(decl({ prop: 'content', value: '""' }))
      .append(decl({ prop: 'position', value: 'absolute' }))
      .append(decl({ prop: 'inset', value: '0' }))
      .append(decl({ prop: 'background-image', value: this.backgroundImage! }))
      .append(decl({ prop: 'background-repeat', value: 'no-repeat' }))
      .append(decl({ prop: 'background-position', value: 'center' }))
      .append(decl({ prop: 'background-size', value: 'contain' }))
      .append(decl({ prop: 'pointer-events', value: 'none' }))
      .append(decl({ prop: 'mix-blend-mode', value: 'screen' }));
    if (declaration.parent) {
      declaration.parent.after(afterRule);
      declaration.parent.after(beforeRule);
      declaration.parent.after(beforeAfterRule);
    }
  },
  positionRelative(declaration: Declaration): void {
    const parent: Rule = declaration.parent as Rule;
    parent.prepend(decl({ prop: 'position', value: 'relative' }));
  },
  removeDeclaration(declaration: Declaration): void {
    declaration.remove();
  },
};

export class SvgStrategy implements Strategy {
  private dependencies: StrategyDependencies;

  constructor(deps: StrategyDependencies = defaultSvgStrategyDependencies) {
    this.dependencies = deps;
  }

  execute(declaration: Declaration): void {
    if (!this.dependencies.findBackgroundImage) {
      throw new Error('findBackgroundImage is not defined');
    }
    this.dependencies.findBackgroundImage(declaration);
    this.dependencies.positionRelative(declaration);
    this.dependencies.addPseudo(declaration);
    this.dependencies.addKeyframes(declaration);
    this.dependencies.removeDeclaration(declaration);
  }
}
