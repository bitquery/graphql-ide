FROM node:16-bookworm-slim AS builder

LABEL maintainer="Andrey Gridin <andrey@bitquery.io>"

WORKDIR /app

COPY package.json package-lock.json* ./

RUN mkdir /app/static && \
  chown node:node -R /app

USER node

RUN npm install --production

COPY --chown=node:node . .

RUN npm run build && chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
