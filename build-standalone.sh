#!/bin/bash

set -e

SOURCE=src
DIST=standalone

export NODE_ENV=production

webpack --config webpack.standalone.config.js -p --bail

echo "----------------------------------------------";
echo "             Build is successful!";
echo "----------------------------------------------";
