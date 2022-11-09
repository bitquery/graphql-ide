FROM node:14.15-alpine AS builder

LABEL maintainer="Andrey Gridin <andrey@bitquery.io>"

ARG SCHEME=https
ARG DOMAIN=graphql.staging.bitq.dev
ARG REACT_APP_IDE_URL=/ide
ARG ENV=production

ENV NODE_ENV="${ENV}" \
    BACKEND_URL="${SCHEME}://${DOMAIN}" \
    PUBLIC_URL="${SCHEME}://${DOMAIN}${REACT_APP_IDE_URL}" \
    IDE_URL="${SCHEME}://${DOMAIN}${REACT_APP_IDE_URL}" \
    REACT_APP_ENDPOINT_URL="${SCHEME}://${DOMAIN}${REACT_APP_IDE_URL}" \
    REACT_APP_IDE_URL="${REACT_APP_IDE_URL}" \
    
    PORT="${PORT}"

WORKDIR /app

COPY package.json package-lock.json* ./

RUN chown node:node -R /app

USER node

RUN npm install --production

COPY --chown=node:node . .

RUN npm run build

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
