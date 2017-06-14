### Five Nations [![Build Status](https://travis-ci.org/vbence86/fivenations.svg?branch=master)](https://travis-ci.org/vbence86/fivenations) [![Build Status](https://semaphoreci.com/api/v1/vbence86/fivenations/branches/master/badge.svg)](https://semaphoreci.com/vbence86/fivenations) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/935f2ebf03654b0a9537d4cc7c4bcd1f)](https://www.codacy.com/app/vbence86/fivenations?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=vbence86/fivenations&amp;utm_campaign=Badge_Grade)
A browser based real time strategy game that uses HTML5 components and runs in the browser. The gameplay is built on Phaser and employs P2 physics engine. Since this is an open source project all form of contribution and feedback are welcomed. 

#### Install
Clone the project
```
git clone https://github.com/vbence86/fivenations.git
```

After cloning the project install the dependencies
```
npm install
```

#### Run Development Server
```
npm start
```

#### Publish
Build the public resources
```
gulp build
```

Execute local HTTP server that listens on port 9000
```
npm run start-server
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
docker run -t -d -p 9000:9000 -p 8899:8899 silversword/fivenations
```
