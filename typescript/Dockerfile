FROM node:18.20-buster-slim

ARG WORKDIR
WORKDIR /${WORKDIR}

COPY package*.json ./
RUN npm install --force
COPY . .
