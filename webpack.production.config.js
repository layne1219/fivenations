const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/js/main.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    publicPath: '/js/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.UglifyJsPlugin({
      drop_console: true,
      minimize: true,
      output: {
        comments: false
      }
    }),
  ],
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
      { test: /\.scss$/, use: ['sass-loader'] },
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
};
