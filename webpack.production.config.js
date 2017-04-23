const path = require('path');
const webpack = require('webpack');
const defaultConfig = require('./webpack.default.config.js');
const packageJson = require('./package.json');
const currentVersion = packageJson.version;
const bundleName = `bundle.${currentVersion}.js`;

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
        path: path.resolve(__dirname, 'dist/js'),
        publicPath: '/js/',
        filename: bundleName
    },
    plugins: plugins
});
