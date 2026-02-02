import { decl } from 'postcss';
import type { GlitchMode, Strategies, Strategy } from '../strategies';
import createTranslator from '../translator';

describe('translator', () => {
  const expectedHeight = '48px';
  const expectedShadowOffset = '1px';
  const expectedFirstColor = '#f00';
  const expectedSecondColor = '#00f';

  it('executes strategy for text mode', () => {
    // Arrange
    const expectedMode: GlitchMode = 'text';
    const expectedDeclaration = decl({
      prop: 'glitch',
      value: `${expectedMode} ${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}`,
    });

    const mockExecute = jest.fn();

    class MockTextStrategy implements Strategy {
      execute = mockExecute;
    }

    const MockStrategies: Strategies = {
      text: MockTextStrategy,
    };

    const translate = createTranslator(MockStrategies);

    // Act
    translate(expectedDeclaration);

    // Assert
    expect(mockExecute).toHaveBeenCalledWith(expectedDeclaration);
  });


  it('executes strategy for svg mode', () => {
    // Arrange
    const expectedMode: GlitchMode = 'svg';
    const expectedDeclaration = decl({
      prop: 'glitch',
      value: `${expectedMode} ${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}`,
    });

    const mockExecute = jest.fn();

    class MockSvgStrategy implements Strategy {
      execute = mockExecute;
    }

    const MockStrategies: Strategies = {
      svg: MockSvgStrategy,
    };

    const translate = createTranslator(MockStrategies);

    // Act
    translate(expectedDeclaration);

    // Assert
    expect(mockExecute).toHaveBeenCalledWith(expectedDeclaration);
  });

  it('throws an error if strategy in not defined', () => {
    // Arrange
    const expectedMode: GlitchMode = 'foo';
    const expectedErrorMessage = `Unknown glitch mode: ${expectedMode}`;
    const expectedDeclaration = decl({
      prop: 'glitch',
      value: `${expectedMode} ${expectedHeight} ${expectedFirstColor} ${expectedSecondColor} ${expectedShadowOffset}`,
    });

    const translate = createTranslator();

    // Act
    try {
      translate(expectedDeclaration);
    } catch (actualError) {

      // Assert
      expect((actualError as Error).message).toEqual(expectedErrorMessage);
    }
  });
});
