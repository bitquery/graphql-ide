FROM node:14.15-alpine AS builder
ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json* ./

#RUN npm ci --only=production && \
RUN npm install --production

COPY . .

RUN chmod +x ./entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["./entrypoint.sh"]
