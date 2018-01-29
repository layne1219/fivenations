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
cp -r $SOURCE/web/* $DIST

webpack-dashboard -- webpack --config ./config/webpack.development.config.js
