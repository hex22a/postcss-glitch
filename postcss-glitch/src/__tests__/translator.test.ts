import type  { Declaration, Root, Rule } from 'postcss';
import { decl, root, rule } from 'postcss';
import type { TranslatorDeps } from '../translator';
import createTranslator, { defaultTranslator } from '../translator';
import mockClipPath from '../clip-path.builder';

jest.mock('../clip-path.builder');

describe('translator', () => {
  const expectedSelector = '.foo';
  const expectedHeight = '48px';
  const expectedShadowOffset = '1px';
  const expectedFirstColor = '#f00';
  const expectedSecondColor = '#00f';

  let expectedRoot: Root;
  let expectedRule: Rule;

  beforeEach(() => {
    expectedRoot = root();
    expectedRule = rule({ selector: expectedSelector });
  });

  it('translate declaration', () => {
    // Arrange
    const expectedDeclaration = decl({
      prop: 'glitch',
      value: `${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}`,
    });

    const mockTranslator: TranslatorDeps = {
      addKeyframes: jest.fn(),
      addPseudo: jest.fn(),
      positionRelative: jest.fn(),
      removeDeclaration: jest.fn(),
    };
    const translate = createTranslator(mockTranslator);

    // Act
    translate(expectedDeclaration);

    // Assert
    expect(mockTranslator.positionRelative).toHaveBeenCalledWith(expectedDeclaration);
    expect(mockTranslator.addPseudo).toHaveBeenCalledWith(expectedDeclaration);
    expect(mockTranslator.addKeyframes).toHaveBeenCalledWith(expectedDeclaration);
    expect(mockTranslator.removeDeclaration).toHaveBeenCalledWith(expectedDeclaration);
  });

  it('adds position: relative to the parent element', () => {
    // Arrange
    const expectedDeclaration = decl({
      prop: 'glitch',
      value: `${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}`,
    });
    expectedRule.append(expectedDeclaration);
    expectedRoot.append(expectedRule);
    const expectedResultCss = `${expectedSelector} {
    position: relative;
    glitch: ${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}
}`;

    // Act
    defaultTranslator.positionRelative(expectedDeclaration);

    // Assert
    expect(expectedRoot.toString()).toEqual(expectedResultCss);
  });

  it('adds ::before and ::after pseudo elements to the rule that contains glitch declaration', () => {
    // Arrange
    const expectedDeclaration = decl({
      prop: 'glitch',
      value: `${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}`,
    });
    expectedRule.append(expectedDeclaration);
    expectedRoot.append(expectedRule);
    const expectedResultCss = `${expectedSelector} {
    glitch: ${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}
}
${expectedSelector}::before, ${expectedSelector}::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    clip-path: inset(${expectedHeight} 0 0 0)
}
${expectedSelector}::before {
    text-shadow: -${expectedShadowOffset} 0 ${expectedFirstColor};
    animation: glitch-animation-before alternate-reverse 3s infinite linear
}
${expectedSelector}::after {
    text-shadow: ${expectedShadowOffset} 0 ${expectedSecondColor};
    animation: glitch-animation-after alternate-reverse 2s infinite linear
}`;

    // Act
    defaultTranslator.addPseudo(expectedDeclaration);

    // Assert
    expect(expectedRoot.toString()).toEqual(expectedResultCss);
  });

  it('adds 2 @keyframes animation with 21 steps at root and glitch height 5px', () => {
    // Arrange
    const expectedOffsetTop = '24px';
    const expectedOffsetBottom = '19px';
    const expectedClipPath = decl({
      prop: 'clip-path',
      value: `inset(${expectedOffsetTop} 0 ${expectedOffsetBottom} 0)`,
    });
    const expectedDeclaration = decl({
      prop: 'glitch',
      value: `${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}`,
    });
    expectedRule.append(expectedDeclaration);
    expectedRoot.append(expectedRule);
    (mockClipPath as jest.Mock).mockImplementation((): Declaration => expectedClipPath.clone());

    // Act
    defaultTranslator.addKeyframes(expectedDeclaration);

    // Assert
    expect(expectedRoot.toString()).toMatchSnapshot();
  });

  it('removes glitch declaration', () => {
    // Arrange
    const expectedDeclaration = decl({
      prop: 'glitch',
      value: `${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}`,
    });
    expectedRule.append(expectedDeclaration);
    expectedRoot.append(expectedRule);
    const expectedResultCss = `${expectedSelector} {}`;

    // Act
    defaultTranslator.removeDeclaration(expectedDeclaration);

    // Assert
    expect(expectedRoot.toString()).toEqual(expectedResultCss);
  });
});
