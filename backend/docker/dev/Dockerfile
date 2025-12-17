# syntax=docker.io/docker/dockerfile:1
FROM node:22.15.1-alpine

RUN apk add --no-cache \
  python3 \
  build-base \
  gcc

WORKDIR /usr/src/app

RUN npm install -g @nestjs/cli
RUN yarn config set network-timeout 600000

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=10 \
  CMD node ./healthcheck.js || exit 1

CMD ["sh", "-c", "yarn install && yarn start:dev"]
