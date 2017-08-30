const path = require('path');
const webpack = require('webpack');
const S3Plugin = require('webpack-s3-plugin');
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

plugins.push(
  new S3Plugin({
    include: /.*\.(js)/,
    directory: 'standalone',
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
    directory: 'src/assets',
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
        path: path.resolve(__dirname, 'standalone/'),
        publicPath: '/',
        filename: bundleName
    },
    plugins: plugins
});
