FROM node:18.12-alpine

ENV NODE_ENV production
ENV DEBUG "botClient:warn,botClient:error,botClient:info"

WORKDIR /usr/src/app

COPY --chown=node:node ./package*.json ./
RUN npm ci --only=production

COPY --chown=node:node . .

RUN npm run compile

CMD [ "npm", "start" ]