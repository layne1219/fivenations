const path = require('path');
const webpack = require('webpack');
const defaultConfig = require('./webpack.default.config.js');
const version = require('./package.json').version;
const bundleName = `fivenations.${version}.js`;

const plugins = defaultConfig.plugins;
plugins.push(
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.UglifyJsPlugin({
        drop_console: true,
        minimize: true,
        output: {
            comments: false
        }
    })
);

module.exports = Object.assign(defaultConfig, {
    output: {
        path: path.resolve(__dirname, 'standalone/'),
        publicPath: '/',
        filename: bundleName
    },
    plugins: plugins
});
