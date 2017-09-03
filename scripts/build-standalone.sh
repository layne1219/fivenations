#!/bin/bash

set -e

export NODE_ENV=production
export S3_PUBLIC_URL=https://s3.amazonaws.com/fivenations

webpack --config ./config/webpack.standalone.config.js -p --bail

echo "----------------------------------------------";
echo "             Build is successful!";
echo "----------------------------------------------";
