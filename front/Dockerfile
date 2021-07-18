FROM node:14.17.3-alpine

ARG WORKDIR
ARG CONTAINER_PORT
ARG API_URL

ENV HOME=/${WORKDIR} \
    LANG=C.UTF-8 \
    TZ=Asia/Tokyo \
    HOST=0.0.0.0  \
    API_URL=${API_URL}

WORKDIR ${HOME}

COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE ${CONTAINER_PORT}
