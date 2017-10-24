#!/bin/bash

set -e

SOURCE=src
DIST=build
RESOURCES=assets

export NODE_ENV=development

if [ -d "$DIST" ]; then rm -Rf $DIST; fi

# RESOURCES
mkdir -p $DIST
cp -r $SOURCE/$RESOURCES $DIST/$RESOURCES

# HTML 
cp $SOURCE/web/index.html $DIST

webpack --config ./config/webpack.development.config.js -p --bail
