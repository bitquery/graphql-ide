FROM node:14.15-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production

COPY package-lock.json package.json ./

RUN npm ci --only=production
#RUN npm install && npm run build

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "server" ]
