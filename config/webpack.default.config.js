const path = require('path');
const webpack = require('webpack');
const paths = require('./paths.js');
const version = require('../package.json').version;

// Phaser webpack config
const phaserModule = path.join(paths.appNodeModules, '/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(paths.appSrc, 'shims/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
  entry: {
    app: ['babel-polyfill', pixi, p2, phaser, paths.appIndexJs],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        PUBLIC_URL: JSON.stringify(paths.publicUrl),
        VERSION: JSON.stringify(version),
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /pixi.js/,
        use: [
          {
            loader: 'expose-loader',
            options: 'PIXI',
          },
        ],
      },
      {
        test: /p2.js/,
        use: [
          {
            loader: 'expose-loader',
            options: 'p2',
          },
        ],
      },
      {
        test: /phaser-split.js/,
        use: [
          {
            loader: 'expose-loader',
            options: 'Phaser',
          },
        ],
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/fonts/',
              publicPath: `${paths.publicUrl}/`,
            },
          },
        ],
      },
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
