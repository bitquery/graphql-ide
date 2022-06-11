FROM node:14.15-alpine AS builder

LABEL maintainer="Andrey Gridin <andrey@bitquery.io>"

ARG SCHEME=https
ARG HOST=localhost
ARG PORT=5000
ARG ENV=production

ENV NODE_ENV="${ENV}" \
    BACKEND_URL="${SCHEME}://${HOST}:${PORT}" \
    IDE_URL="${SCHEME}://${HOST}:${PORT}/" \
    REACT_APP_IDE_URL="" \
    PORT="${PORT}"

WORKDIR /app

COPY package.json package-lock.json* ./

RUN chown node:node -R /app

USER node

RUN npm install --production

COPY --chown=node:node . .

RUN npm run build

RUN chmod +x ./entrypoint.sh

EXPOSE ${PORT}

ENTRYPOINT ["./entrypoint.sh"]
