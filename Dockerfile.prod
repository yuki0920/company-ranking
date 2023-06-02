FROM golang:1.20 as builder

ARG DATABASE_URL
ARG API_PORT
ENV DATABASE_URL=${DATABASE_URL}
ENV API_PORT=${API_PORT}

# Set destination for COPY
WORKDIR /go/src

# Download Go modules
COPY ./go/go.mod ./go/go.sum ./
RUN go mod download

COPY ./go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o run-server

FROM ruby:2.7.4-alpine

ARG DATABASE_URL
ARG API_PORT
ENV DATABASE_URL=${DATABASE_URL}
ENV API_PORT=${API_PORT}

ENV RUNTIME_PACKAGES="linux-headers libxml2-dev make gcc libc-dev nodejs tzdata postgresql-dev postgresql git less gcompat" \
    DEV_PACKAGES="build-base curl-dev" \
    HOME=/${WORKDIR} \
    LANG=C.UTF-8 \
    TZ=Asia/Tokyo

WORKDIR /project

COPY ./rails/Gemfile* ./

RUN apk update && \
    apk upgrade && \
    apk add --no-cache ${RUNTIME_PACKAGES} && \
    apk add --virtual build-dependencies --no-cache ${DEV_PACKAGES} && \
    bundle install -j4 && \
    apk del build-dependencies

COPY --from=builder /go/src/run-server ./
COPY ./rails .

EXPOSE 3333

CMD ["./run-server"]
