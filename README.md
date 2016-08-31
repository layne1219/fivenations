### Five Nations
A browser based real time strategy game that uses HTML5 components and runs in the browser. The gameplay is built on Phaser and employs P2 physics engine. Since this is an open source project all form of contribution and feedback are welcomed. 

#### Install (Dev)
Clone the project and run 
`npm install`
Run the dev environment
`gulp`


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
