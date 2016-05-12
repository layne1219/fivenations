FROM ubuntu:14.04
MAINTAINER Bence Varga <vbence86@gmail.com>

# Environment variables
ENV DOCUMENT_ROOT=/var/www
ENV FIVE_NATIONS_PATH=${DOCUMENT_ROOT}/fivenations
ENV FIVE_NATIONS_REPO=https://github.com/vbence86/fivenations

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    git

# Install app dependencies
RUN npm install -g bower
# bower cannot be excecuted in ROOT mode hence this line 
RUN echo '{"allow_root": true}' > /root/.bowerrc
# bower expects the NodeJS CLI to be named *node*
RUN ln -s "$(which nodejs)" /usr/bin/node
# install gulp globally
RUN npm install -g gulp

# Install app
WORKDIR ${DOCUMENT_ROOT}
RUN git clone ${FIVE_NATIONS_REPO} 
WORKDIR ${FIVE_NATIONS_PATH}
RUN npm install
RUN bower install

# run a NodeJS server and expose the app
WORKDIR ${FIVE_NATIONS_PATH}
CMD gulp publish

# Run app
EXPOSE 9000