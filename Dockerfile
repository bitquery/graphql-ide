FROM node:14.15-alpine AS builder

LABEL maintainer="Andrey Gridin <andrey@bitquery.io>"

ARG ENV
ARG SCHEME
ARG DOMAIN
ARG REACT_APP_IDE_URL

ENV NODE_ENV=${ENV:-production}
ENV BACKEND_URL=${SCHEME:-https}://${DOMAIN:-graphql.bitquery.io}
ENV REACT_APP_IDE_URL=${REACT_APP_IDE_URL:-/ide}
ENV PUBLIC_URL=$BACKEND_URL$REACT_APP_IDE_URL
ENV IDE_URL=$PUBLIC_URL
ENV REACT_APP_ENDPOINT_URL=$PUBLIC_URL

WORKDIR /app

COPY package.json package-lock.json* ./

RUN chown node:node -R /app

USER node

RUN npm install --production

COPY --chown=node:node . .

RUN npm run build

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
