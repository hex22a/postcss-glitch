import type { Declaration } from 'postcss';
import { decl } from 'postcss';
import * as builder from '../clip-path.builder';

describe('clip-path builder', () => {
  it('returns clip-path declaration - glitchHeight passed', () => {
    // Arrange
    const expectedParsedHeight = 51;
    const expectedSizeUnit = 'px';
    const expectedHeight = `${expectedParsedHeight}${expectedSizeUnit}`;
    const expectedOffsetTop = 25;
    const expectedGlitchHeight = 5;
    const expectedOffsetBottom = 21;
    const expectedClipPath: Declaration = decl({
      prop: 'clip-path',
      value: `inset(${expectedOffsetTop}${expectedSizeUnit} 0 ${expectedOffsetBottom}${expectedSizeUnit} 0)`,
    });

    const fakeGetOffsetTop = (): number => expectedOffsetTop;
    const fakeGetOffsetBottom = (): number => expectedOffsetBottom;

    const mockParseHeight = jest.fn((): [number, string] => [expectedParsedHeight, expectedSizeUnit]);

    builder.utils.getOffsetTop = fakeGetOffsetTop;
    builder.utils.getOffsetBottom = fakeGetOffsetBottom;
    builder.utils.parseHeight = mockParseHeight;

    // Act
    const actualClipPath = builder.default(expectedHeight, expectedGlitchHeight);

    // Assert
    expect(mockParseHeight).toHaveBeenCalledWith(expectedHeight);
    expect(actualClipPath).toEqual(expectedClipPath);
  });

  it('returns clip-path declaration - glitchHeight passed in rem', () => {
    // Arrange
    const expectedParsedHeight = 51;
    const expectedSizeUnit = 'rem';
    const expectedHeight = `${expectedParsedHeight}${expectedSizeUnit}`;
    const expectedOffsetTop = 25;
    const expectedGlitchHeight = 5;
    const expectedOffsetBottom = 21;
    const expectedClipPath: Declaration = decl({
      prop: 'clip-path',
      value: `inset(${expectedOffsetTop}${expectedSizeUnit} 0 ${expectedOffsetBottom}${expectedSizeUnit} 0)`,
    });

    const fakeGetOffsetTop = (): number => expectedOffsetTop;
    const fakeGetOffsetBottom = (): number => expectedOffsetBottom;

    const mockParseHeight = jest.fn((): [number, string] => [expectedParsedHeight, expectedSizeUnit]);

    builder.utils.getOffsetTop = fakeGetOffsetTop;
    builder.utils.getOffsetBottom = fakeGetOffsetBottom;
    builder.utils.parseHeight = mockParseHeight;

    // Act
    const actualClipPath = builder.default(expectedHeight, expectedGlitchHeight);

    // Assert
    expect(mockParseHeight).toHaveBeenCalledWith(expectedHeight);
    expect(actualClipPath).toEqual(expectedClipPath);
  });

  it('returns clip-path declaration - default glitchHeight = 5px', () => {
    // Arrange
    const expectedParsedHeight = 51;
    const expectedSizeUnit = 'px';
    const expectedHeight = `${expectedParsedHeight}${expectedSizeUnit}`;
    const expectedOffsetTop = 25;
    const expectedOffsetBottom = 21;
    const expectedClipPath = decl({
      prop: 'clip-path',
      value: `inset(${expectedOffsetTop}px 0 ${expectedOffsetBottom}px 0)`,
    });

    const fakeGetOffsetTop = (): number => expectedOffsetTop;
    const fakeGetOffsetBottom = (): number => expectedOffsetBottom;

    const mockParseHeight = jest.fn((): [number, string] => [expectedParsedHeight, expectedSizeUnit]);

    builder.utils.getOffsetTop = fakeGetOffsetTop;
    builder.utils.getOffsetBottom = fakeGetOffsetBottom;
    builder.utils.parseHeight = mockParseHeight;

    // Act
    const actualClipPath = builder.default(expectedHeight);

    // Assert
    expect(mockParseHeight).toHaveBeenCalledWith(expectedHeight);
    expect(actualClipPath).toEqual(expectedClipPath);
  });

  describe('parse height', () => {
    it('px', () => {
      // Arrange
      const expectedParsedHeight = 51;
      const expectedSizeUnit = 'px';
      const expectedHeight = `${expectedParsedHeight}${expectedSizeUnit}`;

      // Act
      const [actualParsedHeight, actualSizeUnit] = builder.parseHeight(expectedHeight);

      // Assert
      expect(actualParsedHeight).toEqual(expectedParsedHeight);
      expect(actualSizeUnit).toEqual(expectedSizeUnit);
    });

    it('em', () => {
      // Arrange
      const expectedParsedHeight = 51;
      const expectedSizeUnit = 'em';
      const expectedHeight = `${expectedParsedHeight}${expectedSizeUnit}`;

      // Act
      const [actualParsedHeight, actualSizeUnit] = builder.parseHeight(expectedHeight);

      // Assert
      expect(actualParsedHeight).toEqual(expectedParsedHeight);
      expect(actualSizeUnit).toEqual(expectedSizeUnit);
    });

    it('pt', () => {
      // Arrange
      const expectedParsedHeight = 51;
      const expectedSizeUnit = 'pt';
      const expectedHeight = `${expectedParsedHeight}${expectedSizeUnit}`;

      // Act
      const [actualParsedHeight, actualSizeUnit] = builder.parseHeight(expectedHeight);

      // Assert
      expect(actualParsedHeight).toEqual(expectedParsedHeight);
      expect(actualSizeUnit).toEqual(expectedSizeUnit);
    });

    it('%', () => {
      // Arrange
      const expectedParsedHeight = 51;
      const expectedSizeUnit = '%';
      const expectedHeight = `${expectedParsedHeight}${expectedSizeUnit}`;

      // Act
      const [actualParsedHeight, actualSizeUnit] = builder.parseHeight(expectedHeight);

      // Assert
      expect(actualParsedHeight).toEqual(expectedParsedHeight);
      expect(actualSizeUnit).toEqual(expectedSizeUnit);
    });

    it('rem', () => {
      // Arrange
      const expectedParsedHeight = 51;
      const expectedSizeUnit = 'rem';
      const expectedHeight = `${expectedParsedHeight}${expectedSizeUnit}`;

      // Act
      const [actualParsedHeight, actualSizeUnit] = builder.parseHeight(expectedHeight);

      // Assert
      expect(actualParsedHeight).toEqual(expectedParsedHeight);
      expect(actualSizeUnit).toEqual(expectedSizeUnit);
    });
  });

  it('returns top offset', () => {
    // Arrange
    const expectedHeight = 51;
    const expectedOffsetTop = 25;
    const expectedRandomNumber = 0.5;

    const mockRandom = jest
      .spyOn(Math, 'random')
      .mockReturnValue(expectedRandomNumber);

    // Act
    const actualOffsetTop = builder.getOffsetTop(expectedHeight);

    // Assert
    expect(mockRandom).toHaveBeenCalled();
    expect(actualOffsetTop).toEqual(expectedOffsetTop);
  });

  it('returns bottom offset', () => {
    // Arrange
    const expectedHeight = 51;
    const expectedOffsetTop = 25;
    const expectedGlitchHeight = 5;
    const expectedOffsetBottom = 21;

    // Act
    const actualOffsetBottom = builder.getOffsetBottom(expectedHeight, expectedOffsetTop, expectedGlitchHeight);

    // Assert
    expect(actualOffsetBottom).toEqual(expectedOffsetBottom);
  });
});
