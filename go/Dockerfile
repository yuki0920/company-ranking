FROM golang:1.20

# Set destination for COPY
WORKDIR /go/src

# Download Go modules
COPY ./go.* ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o ./bin/run-server

CMD ["./bin/run-server"]
