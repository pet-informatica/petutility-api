FROM node:8

MAINTAINER PET

RUN npm install -g nodemon

RUN mkdir -pv /www
WORKDIR /www

CMD npm run devStart
