FROM node:14.17.3-alpine

ARG WORKDIR
ARG CONTAINER_PORT

ENV HOME=/${WORKDIR} \
    LANG=C.UTF-8 \
    TZ=Asia/Tokyo \
    HOST=0.0.0.0 \
    API_URL=${API_URL} \
    NPM_CONFIG_PRODUCTION=false

RUN echo ${CONTAINER_PORT}

WORKDIR ${HOME}

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn run generate

EXPOSE ${CONTAINER_PORT}
