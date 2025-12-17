# syntax=docker.io/docker/dockerfile:1
FROM node:22.15.1-alpine

WORKDIR /usr/src/app

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=10 \
  CMD node ./healthcheck.js || exit 1

EXPOSE 6314

CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0 --port ${VITE_DEV_SERVER_PORT:-6314}"]
