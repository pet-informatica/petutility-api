FROM	node:8

MAINTAINER PET

RUN npm install -g nodemon bower gulp-cli

RUN mkdir -pv /www
WORKDIR /www

CMD npm run devStart
