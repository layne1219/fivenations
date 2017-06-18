### Five Nations [![Build Status](https://travis-ci.org/vbence86/fivenations.svg?branch=master)](https://travis-ci.org/vbence86/fivenations) [![Build Status](https://semaphoreci.com/api/v1/vbence86/fivenations/branches/master/badge.svg)](https://semaphoreci.com/vbence86/fivenations) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/935f2ebf03654b0a9537d4cc7c4bcd1f)](https://www.codacy.com/app/vbence86/fivenations?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=vbence86/fivenations&amp;utm_campaign=Badge_Grade)[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)[![Gitter](https://img.shields.io/gitter/room/fivenations/Lobby.svg?maxAge=2592000)](https://img.shields.io/gitter/room/fivenations/Lobby)

A browser based real time strategy game that uses cutting-edge HTML5 technologies and can be integrated into any HTML5 client. The project is built on Phaser and employs P2 physics engine. Since this is an open source project all form of contribution and feedback are welcomed. 

#### Install
Clone the project
```
git clone https://github.com/vbence86/fivenations.git
```

After cloning the project install the dependencies
```
yarn install
```

#### Run Development Server
```
yarn run dev
```

#### Publish
Build the public resources
```
yarn run build
```

#### Create self-contained bundle for external integrations
Build the standalone bundle and upload them into S3
```
yarn run build-standalone
```

Open the application in a browser
```
http://127.0.0.1:9000
```

#### Publish with Docker
Clone the project and build a docker image by runnning 
```
cd docker
docker build -n silversword/fivenations ./
```
Run the docker image in a new container 
```
docker run -t -d -p 9000:9000 silversword/fivenations
```
