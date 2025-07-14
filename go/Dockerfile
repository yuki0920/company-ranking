FROM golang:1.23

# Set destination for COPY
WORKDIR /go/src

# Download Go modules
COPY ./go.* ./
RUN go mod download

COPY . .

# Set GOBIN and add it to PATH
ENV GOBIN /go/bin
ENV PATH $GOBIN:$PATH

RUN make install/tools

RUN CGO_ENABLED=0 GOOS=linux go build -o /go/bin/server ./cmd/server

CMD ["/go/bin/server"]
