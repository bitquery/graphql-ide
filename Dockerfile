FROM node:14.15-alpine AS builder

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json* ./

RUN chown node:node -R /app

USER node

RUN npm install --production

COPY --chown=node:node . .

RUN npm run build

RUN chmod +x ./entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["./entrypoint.sh"]
