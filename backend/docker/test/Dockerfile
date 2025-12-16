# syntax=docker.io/docker/dockerfile:1
FROM node:22.15.1-alpine AS build

WORKDIR /usr/src/app

COPY ./app/package.json ./app/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./app .
RUN yarn build

FROM node:22.15.1-alpine AS runtime
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/yarn.lock ./yarn.lock
RUN yarn install --production --frozen-lockfile

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/healthcheck.js ./healthcheck.js

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
  CMD node ./healthcheck.js || exit 1

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
