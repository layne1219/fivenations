#!/bin/bash

set -e

SOURCE=src
DIST=dist
RESOURCES=assets

export NODE_ENV=production

if [ -d "$DIST" ]; then rm -Rf $DIST; fi

webpack -p --bail

# RESOURCES
cp -r $RESOURCES $DIST/$RESOURCES

# HTML 
cp $SOURCE/web/index.html $DIST
cp $SOURCE/web/favicon.ico $DIST
cp $SOURCE/web/sitemap.xml $DIST
cp $SOURCE/web/robots.txt $DIST

echo "----------------------------------------------";
echo "             Build is successful!";
echo "----------------------------------------------";
