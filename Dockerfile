FROM node:14.15-alpine AS builder

LABEL maintainer="Andrey Gridin <andrey@bitquery.io>"

WORKDIR /app

COPY package.json package-lock.json* ./

RUN chown node:node -R /app

VOLUME /app/static

USER node

RUN npm install --production

COPY --chown=node:node . .

RUN npm run build && chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
