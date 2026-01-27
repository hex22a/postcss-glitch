/* eslint-disable @typescript-eslint/no-var-requires */
require('webpack');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const sourcePath = path.resolve(__dirname, 'src');
const staticsPath = path.resolve(__dirname, 'dist');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';
const isRunningOnCi = Boolean(process.env.CI);

const plugins = [];

if (!isRunningOnCi) {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  mode: isProd ? 'production' : 'development',

  devtool: isProd ? false : 'eval-source-map',

  context: sourcePath,

  entry: {
    bundle: './index.ts',
  },

  target: 'node',

  output: {
    path: staticsPath,
    filename: 'index.js',
    library: {
      type: 'umd',
      export: 'default',
    },
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        include: sourcePath,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
      },
    ],
  },

  plugins,

  stats: 'minimal',
};
