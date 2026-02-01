import type { Declaration, Root, Rule } from 'postcss';
import { decl, root, rule } from 'postcss';
import Translator from '../translator';
import mockClipPath from '../clip-path.builder';

jest.mock('../clip-path.builder');

describe('translator', () => {
  const originalTranslator = {
    positionRelative: Translator.positionRelative,
    addPseudo: Translator.addPseudo,
    addKeyframes: Translator.addKeyframes,
    removeDeclaration: Translator.removeDeclaration,
  };
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

  afterEach(() => {
    Translator.positionRelative = originalTranslator.positionRelative;
    Translator.addPseudo = originalTranslator.addPseudo;
    Translator.addKeyframes = originalTranslator.addKeyframes;
    Translator.removeDeclaration = originalTranslator.removeDeclaration;
  });

  it('translate declaration', () => {
    // Arrange
    const expectedDeclaration = decl({
      prop: 'glitch',
      value: `${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}`,
    });

    const mockPositionRelative = jest.fn();
    const mockAddPseudo = jest.fn();
    const mockAddKeyframes = jest.fn();
    const mockRemoveDeclaration = jest.fn();

    Translator.positionRelative = mockPositionRelative;
    Translator.addPseudo = mockAddPseudo;
    Translator.addKeyframes = mockAddKeyframes;
    Translator.removeDeclaration = mockRemoveDeclaration;

    // Act
    Translator.translate(expectedDeclaration);

    // Assert
    expect(mockPositionRelative).toHaveBeenCalledWith(expectedDeclaration);
    expect(mockAddPseudo).toHaveBeenCalledWith(expectedDeclaration);
    expect(mockAddKeyframes).toHaveBeenCalledWith(expectedDeclaration);
    expect(mockRemoveDeclaration).toHaveBeenCalledWith(expectedDeclaration);
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
    Translator.positionRelative(expectedDeclaration);

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
    Translator.addPseudo(expectedDeclaration);

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
    Translator.addKeyframes(expectedDeclaration);

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
    Translator.removeDeclaration(expectedDeclaration);

    // Assert
    expect(expectedRoot.toString()).toEqual(expectedResultCss);
  });
});
