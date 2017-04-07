const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      }      
    ]
  },
  entry: [
    './src/js/main.js',
    './src/scss/main.scss'
  ],
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
            warnings: false
        },
        sourceMap: true
    }),
    new HtmlWebpackPlugin({
      template: 'src/pug/app.pug'
    })
  ]
}
