const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const defaultConfig = require('./webpack.default.config.js');
const plugins = defaultConfig.plugins;

plugins.push(
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
);

module.exports = Object.assign(defaultConfig, {
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        publicPath: '/js/',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    watch: true,
    plugins: plugins
});
