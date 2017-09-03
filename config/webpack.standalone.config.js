const path = require('path');
const webpack = require('webpack');
const S3Plugin = require('webpack-s3-plugin');
const defaultConfig = require('./webpack.default.config.js');
const paths = require('./paths.js');
const version = require(paths.appPackageJson).version;
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

plugins.push(
  new S3Plugin({
    include: /.*\.(js)/,
    directory: paths.appLib,
    s3Options: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    s3UploadOptions: {
      Bucket: 'fivenations'
    }
  }),
  new S3Plugin({
    include: /.*\.(gif|jpg|jpeg|png|json)/,
    directory: paths.appSrc + '/assets',
    s3Options: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    s3UploadOptions: {
      Bucket: 'fivenations/assets'
    }
  })
);

module.exports = Object.assign(defaultConfig, {
    output: {
        path: paths.appLib,
        publicPath: '/',
        filename: bundleName
    },
    plugins: plugins
});
