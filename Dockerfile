FROM node:16.13
COPY package.json package-lock.json ./
RUN npm ci
WORKDIR /usr/src/app
COPY src ./