const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    entry: {
        app: [
            'babel-polyfill',
            path.resolve(__dirname, 'src/js/browser-connector.js')
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        publicPath: '/js/',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    watch: true,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 9000,
            server: {
                baseDir: ['./', './dist']
            }
        })
    ],
    module: {
        rules: [
          { test: /(pixi|phaser).js/, use: ['script-loader'] }, 
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
