FROM node:8

MAINTAINER PET

WORKDIR www

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]