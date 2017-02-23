FROM	ubuntu:14.04

MAINTAINER PET

RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - && \
    apt-get -y install nodejs git-all build-essential

RUN npm install -g nodemon bower gulp-cli

RUN mkdir -p /www
WORKDIR /www

CMD npm run devStart