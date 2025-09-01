FROM node:22-bookworm-slim

ARG WORKDIR
WORKDIR /${WORKDIR}

COPY package*.json ./
RUN npm install
COPY . .
