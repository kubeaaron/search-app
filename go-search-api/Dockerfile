FROM golang:1.21-alpine

RUN apk update && apk add git

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go mod tidy
RUN go build -o server ./cmd/server

EXPOSE 8080

CMD ["./server"]
