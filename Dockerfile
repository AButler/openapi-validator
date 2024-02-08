FROM node:alpine AS base

EXPOSE 3000

WORKDIR /app

COPY package.json package-lock.json ./

ENV NODE_ENV=production

RUN npm install

COPY ./dist .

CMD ["node", "index.js"]

