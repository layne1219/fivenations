FROM mhart/alpine-node:7.9.0
MAINTAINER Bence Varga <vbence86@gmail.com>

# Environment variables
ENV DOCUMENT_ROOT=/var/www
ENV FIVE_NATIONS_PATH=${DOCUMENT_ROOT}/fivenations
ENV FIVE_NATIONS_REPO=https://github.com/vbence86/fivenations

# Install git
RUN apk update && \
    apk add bash && \
    apk add --update git && \
    rm -rf /tmp/* /var/cache/apk/*

# Install app
WORKDIR ${DOCUMENT_ROOT}
RUN git clone ${FIVE_NATIONS_REPO} 
WORKDIR ${FIVE_NATIONS_PATH}
RUN git checkout master
RUN npm install

# run a NodeJS server and expose the app
WORKDIR ${FIVE_NATIONS_PATH}
RUN npm run build
RUN npm run stop-server
CMD npm run start-server

# Run app
EXPOSE 9000
