FROM node:18.17-buster-slim

ARG WORKDIR
WORKDIR /${WORKDIR}

COPY package*.json ./
RUN npm install
COPY . .
