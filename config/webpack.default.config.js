const path = require('path');
const webpack = require('webpack');
const paths = require('./paths.js');

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      paths.appIndexJs
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'PUBLIC_URL': JSON.stringify(paths.publicUrl),
      }
    })
  ],
  module: {
    rules: [
      { 
        test: /(pixi|phaser).js/, 
        use: ['script-loader'] 
      }, 
      { 
        test: /\.js$/, 
        use: ['babel-loader'],   
      },
      { 
        test: /\.scss$/, 
        use: ['style-loader', 'css-loader', 'sass-loader'] 
      },
      { 
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, 
        loader: 'url-loader' 
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
};
