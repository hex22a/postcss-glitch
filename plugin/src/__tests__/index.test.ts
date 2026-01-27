import plugin, { DECLARATION_NAME, PLUGIN_NAME } from '../index';
import { mock } from 'jest-mock-extended';
import Root from 'postcss/lib/root';
import mock_utils from '../translator';
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
      expect(actualPlugin.postcssPlugin).toEqual(PLUGIN_NAME);
    });

    describe('Once', () => {
      it('should add glitch declaration', () => {
        // Arrange
        const expected_root: Root = new Root();
        const expected_helpers: Helpers = mock<Helpers>();
        const actualPlugin = plugin() as Plugin;
        const mock_walkDecls = jest.fn();

        expected_root.walkDecls = mock_walkDecls;

        // Act
        if (actualPlugin.Once) {
          actualPlugin.Once(expected_root, expected_helpers);
        }

        // Assert
        expect(mock_walkDecls).toHaveBeenCalledWith(DECLARATION_NAME, mock_utils.translate);
      });
    });
  });
});
