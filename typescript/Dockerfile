FROM node:18.20-buster-slim

ARG WORKDIR
WORKDIR /${WORKDIR}

COPY package*.json ./
RUN npm ci --only=production=false
COPY . .

# Ensure node_modules are properly available
RUN npm install
