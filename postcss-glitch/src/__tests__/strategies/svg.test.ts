import type  { Declaration, Root, Rule } from 'postcss';
import { decl, root, rule } from 'postcss';
import mockClipPath from '../../clip-path.builder';
import type { GlitchMode, StrategyDependencies } from '../../strategies';
import { defaultSvgStrategyDependencies, SvgStrategy } from '../../strategies/svg';

jest.mock('../../clip-path.builder');

describe('svg strategy', () => {
  const expectedSelector = '.foo';
  const expectedHeight = '48px';
  const expectedShadowOffset = '1px';
  const expectedFirstColor = '#f00';
  const expectedSecondColor = '#00f';
  const expectedBackgroundImage = 'url("email.svg")';

  let expectedRoot: Root;
  let expectedRule: Rule;

  beforeEach(() => {
    expectedRoot = root();
    expectedRule = rule({ selector: expectedSelector });
  });

  const expectedMode: GlitchMode = 'svg';
  const expectedDeclaration = decl({
    prop: 'glitch',
    value: `${expectedMode} ${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}`,
  });

  it('translate declaration', () => {
    // Arrange
    const mockTextStrategyDependencies: StrategyDependencies = {
      findBackgroundImage: jest.fn(),
      addKeyframes: jest.fn(),
      addPseudo: jest.fn(),
      positionRelative: jest.fn(),
      removeDeclaration: jest.fn(),
    };
    const textStrategy = new SvgStrategy(mockTextStrategyDependencies);

    // Act
    textStrategy.execute(expectedDeclaration);

    // Assert
    expect(mockTextStrategyDependencies.findBackgroundImage).toHaveBeenCalledWith(expectedDeclaration);
    expect(mockTextStrategyDependencies.positionRelative).toHaveBeenCalledWith(expectedDeclaration);
    expect(mockTextStrategyDependencies.addPseudo).toHaveBeenCalledWith(expectedDeclaration);
    expect(mockTextStrategyDependencies.addKeyframes).toHaveBeenCalledWith(expectedDeclaration);
    expect(mockTextStrategyDependencies.removeDeclaration).toHaveBeenCalledWith(expectedDeclaration);
  });

  describe('findBackgroundImage', () => {
    it('saves background-image property values to backgroundImage if value is presented', () => {
      // Arrange
      defaultSvgStrategyDependencies.backgroundImage = undefined;
      const expectedBackgroundImageDecl = decl({
        prop: 'background-image',
        value: expectedBackgroundImage,
      });

      expectedRule.append(expectedDeclaration);
      expectedRule.append(expectedBackgroundImageDecl);
      expectedRoot.append(expectedRule);

      // Act
      defaultSvgStrategyDependencies.findBackgroundImage!(expectedDeclaration);

      // Assert
      expect(defaultSvgStrategyDependencies.backgroundImage).toEqual(expectedBackgroundImage);
    });

    it('throws an error if value is not presented', () => {
      // Arrange
      const expectedErrorMessage = 'background-image is required';
      expectedRule.append(expectedDeclaration);
      expectedRoot.append(expectedRule);

      // Act
      try {
        defaultSvgStrategyDependencies.findBackgroundImage!(expectedDeclaration);
      } catch (actualError) {
        // Assert
        expect((actualError as Error).message).toEqual(expectedErrorMessage);
      }
    });
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
    defaultSvgStrategyDependencies.positionRelative(expectedDeclaration);

    // Assert
    expect(expectedRoot.toString()).toEqual(expectedResultCss);
  });

  it('adds ::before and ::after pseudo elements to the rule that contains glitch declaration', () => {
    // Arrange
    defaultSvgStrategyDependencies.backgroundImage = expectedBackgroundImage;
    expectedRule.append(expectedDeclaration);
    expectedRoot.append(expectedRule);
    const expectedResultCss = `${expectedSelector} {
    glitch: ${expectedMode} ${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}
}
${expectedSelector}::before, ${expectedSelector}::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: ${expectedBackgroundImage};
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    pointer-events: none;
    mix-blend-mode: screen
}
${expectedSelector}::before {
    transform: translate(-${expectedShadowOffset}, 0);
    filter: drop-shadow(-${expectedShadowOffset} 0 ${expectedFirstColor});
    animation: glitch-svg-animation-before 3s infinite steps(5, end)
}
${expectedSelector}::after {
    transform: translate(${expectedShadowOffset}, 0);
    filter: drop-shadow(${expectedShadowOffset} 0 ${expectedSecondColor});
    animation: glitch-svg-animation-after 2s infinite steps(5, end)
}`;

    // Act
    defaultSvgStrategyDependencies.addPseudo(expectedDeclaration);

    // Assert
    expect(expectedRoot.toString()).toEqual(expectedResultCss);
  });

  it('adds 2 @keyframes animation with 21 steps at root and glitch height 5px', () => {
    // Arrange
    const expectedOffsetTop = '10%';
    const expectedOffsetBottom = '22%';
    const expectedClipPath = decl({
      prop: 'clip-path',
      value: `inset(${expectedOffsetTop} 0 ${expectedOffsetBottom} 0)`,
    });
    expectedRule.append(expectedDeclaration);
    expectedRoot.append(expectedRule);
    (mockClipPath as jest.Mock).mockImplementation((): Declaration => expectedClipPath.clone());

    // Act
    defaultSvgStrategyDependencies.addKeyframes(expectedDeclaration);

    // Assert
    expect(expectedRoot.toString()).toMatchSnapshot();
  });

  it('removes glitch declaration', () => {
    // Arrange
    expectedRule.append(expectedDeclaration);
    expectedRoot.append(expectedRule);
    const expectedResultCss = `${expectedSelector} {}`;

    // Act
    defaultSvgStrategyDependencies.removeDeclaration(expectedDeclaration);

    // Assert
    expect(expectedRoot.toString()).toEqual(expectedResultCss);
  });
});
