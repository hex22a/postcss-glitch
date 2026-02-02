import type  { Declaration, Root, Rule } from 'postcss';
import { decl, root, rule } from 'postcss';
import mockClipPath from '../../clip-path.builder';
import type { GlitchMode, StrategyDependencies } from '../../strategies';
import { defaultTextStrategyDependencies, TextStrategy } from '../../strategies/text';

jest.mock('../../clip-path.builder');

describe('text strategy', () => {
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

  const expectedMode: GlitchMode = 'text';
  const expectedDeclaration = decl({
    prop: 'glitch',
    value: `${expectedMode} ${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}`,
  });

  it('translate declaration', () => {
    // Arrange
    const mockTextStrategyDependencies: StrategyDependencies = {
      addKeyframes: jest.fn(),
      addPseudo: jest.fn(),
      positionRelative: jest.fn(),
      removeDeclaration: jest.fn(),
    };
    const textStrategy = new TextStrategy(mockTextStrategyDependencies);

    // Act
    textStrategy.execute(expectedDeclaration);

    // Assert
    expect(mockTextStrategyDependencies.positionRelative).toHaveBeenCalledWith(expectedDeclaration);
    expect(mockTextStrategyDependencies.addPseudo).toHaveBeenCalledWith(expectedDeclaration);
    expect(mockTextStrategyDependencies.addKeyframes).toHaveBeenCalledWith(expectedDeclaration);
    expect(mockTextStrategyDependencies.removeDeclaration).toHaveBeenCalledWith(expectedDeclaration);
  });

  it('adds position: relative to the parent element', () => {
    // Arrange
    expectedRule.append(expectedDeclaration);
    expectedRoot.append(expectedRule);
    const expectedResultCss = `${expectedSelector} {
    position: relative;
    glitch: ${expectedMode} ${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}
}`;

    // Act
    defaultTextStrategyDependencies.positionRelative(expectedDeclaration);

    // Assert
    expect(expectedRoot.toString()).toEqual(expectedResultCss);
  });

  it('adds ::before and ::after pseudo elements to the rule that contains glitch declaration', () => {
    // Arrange
    expectedRule.append(expectedDeclaration);
    expectedRoot.append(expectedRule);
    const expectedResultCss = `${expectedSelector} {
    glitch: ${expectedMode} ${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}
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
    defaultTextStrategyDependencies.addPseudo(expectedDeclaration);

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
    expectedRule.append(expectedDeclaration);
    expectedRoot.append(expectedRule);
    (mockClipPath as jest.Mock).mockImplementation((): Declaration => expectedClipPath.clone());

    // Act
    defaultTextStrategyDependencies.addKeyframes(expectedDeclaration);

    // Assert
    expect(expectedRoot.toString()).toMatchSnapshot();
  });

  it('removes glitch declaration', () => {
    // Arrange
    expectedRule.append(expectedDeclaration);
    expectedRoot.append(expectedRule);
    const expectedResultCss = `${expectedSelector} {}`;

    // Act
    defaultTextStrategyDependencies.removeDeclaration(expectedDeclaration);

    // Assert
    expect(expectedRoot.toString()).toEqual(expectedResultCss);
  });
});
