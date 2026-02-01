import plugin, { DECLARATION_NAME, PLUGIN_NAME } from '../index';
import { mock } from 'jest-mock-extended';
import Root from 'postcss/lib/root';
import mockCreateTranslator from '../translator';
import type { Helpers, Plugin, Processor } from 'postcss';

jest.mock('../translator');

function expectPlugin(p: Plugin | Processor): asserts p is Plugin {
  if (!p || typeof p !== 'object' || !('postcssPlugin' in p)) {
    throw new Error('Expected PostCSS Plugin');
  }
}

describe('index', () => {
  it('should have property postcss = true', () => {
    // Arrange
    // Act
    // Assert
    expect(plugin.postcss).toEqual(true);
  });

  describe('Plugin', () => {
    it('should have PLUGIN_NAME', () => {
      // Arrange
      // Act
      const actualPlugin = plugin();
      // Assert
      expectPlugin(actualPlugin);
      expect(mockCreateTranslator).toHaveBeenCalledWith();
      expect(actualPlugin.postcssPlugin).toEqual(PLUGIN_NAME);
    });

    describe('Once', () => {
      it('should add glitch declaration', () => {
        // Arrange
        const expected_root: Root = new Root();
        const expected_helpers: Helpers = mock<Helpers>();
        const mockWalkDecls = jest.fn();
        const mockTranslate = jest.fn();
        (mockCreateTranslator as jest.Mock).mockReturnValue(mockTranslate);

        const actualPlugin = plugin() as Plugin;

        expected_root.walkDecls = mockWalkDecls;

        // Act
        if (actualPlugin.Once) {
          actualPlugin.Once(expected_root, expected_helpers);
        }

        // Assert
        expect(mockWalkDecls).toHaveBeenCalledWith(DECLARATION_NAME, mockTranslate);
      });
    });
  });
});
