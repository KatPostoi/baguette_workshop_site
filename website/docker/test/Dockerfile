# syntax=docker.io/docker/dockerfile:1
FROM node:22.15.1-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "build"]
